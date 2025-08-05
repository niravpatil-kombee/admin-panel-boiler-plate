import { useForm, useFieldArray, Controller } from "react-hook-form";
import {
  Box,
  Button,
  CircularProgress,
  MenuItem,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import type { Category, Brand, Attribute } from "../../types/product";
import {
  createProductAPI,
  getProductByIdAPI,
  updateProductAPI,
} from "../../services/product.api";
import { getCategoriesAPI } from "../../services/category.api";
import { getBrandsAPI } from "../../services/brand.api";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import VariantForm from "./VariantForm";
import { getAttributesAPI } from "../../services/attributes.api";
import { getInventoryListAPI } from "../../services/inventory.api";

const productSchema = z.object({
  name: z.string().min(1, "Name is required"),
  slug: z.string().min(1, "Slug is required"),
  category: z.string().min(1, "Category is required"),
  brand: z.string().min(1, "Brand is required"),
  description: z.string().optional(),
  productAttributes: z
    .array(z.object({ attributeId: z.string(), value: z.any() }))
    .optional(),
  variants: z
    .array(
      z.object({
        name: z.string(),
        sku: z.string(),
        price: z.coerce.number(),
        stock: z.coerce.number(),
        images: z.array(z.union([z.string(), z.instanceof(File)])).optional(),
        attributes: z
          .array(z.object({ attributeId: z.string(), value: z.any() }))
          .optional(),
        inventory: z.string().min(1), 
      })
    )
    .optional(),
});

type ProductFormSchema = z.infer<typeof productSchema>;

export default function ProductFormPage() {
  // console.log('[ProductFormPage] Rendered');
  const { id } = useParams<{ id: string }>();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [attributes, setAttributes] = useState<Attribute[]>([]);
  const [inventories, setInventories] = useState<
    { _id: string; sku: string }[]
  >([]);
  const form = useForm<ProductFormSchema>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: "",
      slug: "",
      description: "",
      category: "",
      brand: "",
      productAttributes: [],
      variants: [],
    },
  });
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(false);
  const nameValue = form.watch('name');

  const {
    control,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = form;

  const {
    fields: variantFields,
    append: appendVariant,
    remove: removeVariant,
  } = useFieldArray({ control, name: "variants" });

  // Auto-generate slug from name unless manually edited
  useEffect(() => {
    if (!slugManuallyEdited) {
      const generatedSlug = nameValue
        ? nameValue
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)+/g, '')
        : '';
      form.setValue('slug', generatedSlug, { shouldValidate: true });
    }
  }, [nameValue, slugManuallyEdited]);

  useEffect(() => {
    Promise.all([
      getCategoriesAPI(),
      getBrandsAPI(),
      getAttributesAPI(),
      getInventoryListAPI(),
    ]).then(([catData, brandData, attrData, inventoryData]) => {
      setCategories(catData.categories);
      setBrands(brandData.brands);
      setAttributes(attrData.attributes);
      setInventories(
        (inventoryData.inventories || []).map((inv: any) => ({
          _id: inv._id,
          sku: inv.sku,
        }))
      );
    });

    if (isEdit && id) {
      setLoading(true);
      getProductByIdAPI(id)
        .then((product) => {
          if (!product) throw new Error("Product not found");
          reset({
            ...product,
            brand:
              product.brand &&
              typeof product.brand === "object" &&
              "_id" in product.brand
                ? (product.brand as any)._id
                : product.brand,
            category:
              product.category &&
              typeof product.category === "object" &&
              "_id" in product.category
                ? (product.category as any)._id
                : product.category,
            productAttributes: (product.productAttributes ?? []).map(
              (attr) => ({
                ...attr,
                attributeId:
                  attr.attributeId &&
                  typeof attr.attributeId === "object" &&
                  "_id" in (attr.attributeId as any)
                    ? (attr.attributeId as any)._id
                    : attr.attributeId,
              })
            ),
            variants: (product.variants ?? []).map((v) => ({
              ...v,
              attributes: (v.attributes ?? []).map((attr) => ({
                ...attr,
                attributeId:
                  attr.attributeId &&
                  typeof attr.attributeId === "object" &&
                  "_id" in (attr.attributeId as any)
                    ? (attr.attributeId as any)._id
                    : attr.attributeId,
              })),
              images: v.images ?? [],
              price: v.price ?? 0,
              stock: v.stock ?? 0,
              inventory:
                typeof v.inventory === "object" && v.inventory !== null && "_id" in v.inventory
                  ? String(v.inventory._id)
                  : typeof v.inventory === "string"
                    ? v.inventory
                    : "",
            })),
          });
        })
        .catch((err) => {
          console.error("Failed to fetch product:", err);
          alert("Product not found or failed to fetch.");
          navigate("/products");
        })
        .finally(() => setLoading(false));
    }
  }, [id, isEdit, reset]);

  const onSubmit = async (data: ProductFormSchema) => {
    try {
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("slug", data.slug);
      formData.append("category", data.category);
      formData.append("brand", data.brand);
      formData.append("description", data.description ?? "");

      // Handle product-level file attributes
      const productAttributesPayload = (data.productAttributes ?? []).map(
        (attr, idx) => {
          const attrDef = attributes.find((a) => a._id === attr.attributeId);
          if (
            attrDef &&
            attrDef.inputType === "file" &&
            attr.value instanceof File
          ) {
            const fileKey = `productImage_${idx}`;
            formData.append(fileKey, attr.value);
            return { ...attr, value: fileKey, inputType: "file", fileKey };
          }
          return attr;
        }
      );
      formData.append(
        "productAttributes",
        JSON.stringify(productAttributesPayload)
      );

      // Handle variants
      const variantPayload = (data.variants ?? []).map((variant, vIdx) => {
        // Handle variant images
        if (variant.images) {
          variant.images.forEach((file, fileIdx) => {
            formData.append(`variantImages_${vIdx}_${fileIdx}`, file);
            });
          }
        // Handle variant attribute files
        const attributesPayload = (variant.attributes ?? []).map(
          (attr, aIdx) => {
            const attrDef = attributes.find((a) => a._id === attr.attributeId);
            if (
              attrDef &&
              attrDef.inputType === "file" &&
              attr.value instanceof File
            ) {
              const fileKey = `variantImage_${vIdx}_${aIdx}`;
              formData.append(fileKey, attr.value);
              return { ...attr, value: fileKey, inputType: "file", fileKey };
            }
            return attr;
          }
        );
          return {
            ...variant,
            images: (variant.images ?? []).map(
            (_, fileIdx) => `variantImages_${vIdx}_${fileIdx}`
            ),
          attributes: attributesPayload,
          };
      });
      formData.append("variants", JSON.stringify(variantPayload));

      if (isEdit && id) {
        console.log("[onSubmit] Calling updateProductAPI", { id, formData });
        await updateProductAPI(id, formData);
        console.log("[onSubmit] updateProductAPI success");
      } else {
        console.log("[onSubmit] Calling createProductAPI", formData);
        await createProductAPI(formData);
        console.log("[onSubmit] createProductAPI success");
      }
      navigate("/products");
    } catch (err) {
      alert("Failed to create/update product. See console for details.");
      console.error("[onSubmit] Error:", err);
    }
  };

  if (loading)
    return (
      <Box textAlign="center" mt={4}>
        <CircularProgress />
      </Box>
    );

  const productLevelAttributes = attributes.filter(
    (attr) => !attr.isVariantLevel
  );
  const variantLevelAttributes = attributes.filter(
    (attr) => attr.isVariantLevel
  );

  console.log("[ProductFormPage] formState.errors:", form.formState.errors);

  return (
    <Box
      maxWidth="sm"
      mx="auto"
      p={4}
      component="form"
      onSubmit={(e) => {
        console.log("[ProductFormPage] Form submit event");
        handleSubmit(onSubmit)(e);
      }}
    >
      <Typography variant="h4" gutterBottom>
        {isEdit ? "Edit Product" : "Create Product"}
      </Typography>
      <Box display="flex" gap={2} mb={2}>
        <Controller
          name="name"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="Name"
              fullWidth
              error={!!form.formState.errors.name}
              helperText={form.formState.errors.name?.message}
              onChange={e => {
                field.onChange(e);
                setSlugManuallyEdited(false);
              }}
            />
          )}
        />

        <Controller
          name="slug"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="Slug"
              fullWidth
              error={!!form.formState.errors.slug}
              helperText={form.formState.errors.slug?.message}
              onChange={e => {
                field.onChange(e);
                setSlugManuallyEdited(true);
              }}
            />
          )}
        />
      </Box>

      <Box display="flex" gap={2} mb={2}>
        <Controller
          name="category"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="Category"
              select
              fullWidth
              error={!!form.formState.errors.category}
              helperText={form.formState.errors.category?.message}
            >
              {categories.map((cat) => (
                <MenuItem key={cat._id} value={cat._id}>
                  {cat.name}
                </MenuItem>
              ))}
            </TextField>
          )}
        />

        <Controller
          name="brand"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="Brand"
              select
              fullWidth
              error={!!form.formState.errors.brand}
              helperText={form.formState.errors.brand?.message}
            >
              {brands.map((brand) => (
                <MenuItem key={brand._id} value={brand._id}>
                  {brand.name}
                </MenuItem>
              ))}
            </TextField>
          )}
        />
      </Box>

      <Controller
        name="description"
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            label="Description"
            multiline
            rows={3}
            fullWidth
            sx={{ mb: 2 }}
          />
        )}
      />

      <Typography variant="h6" mt={4} mb={2}>
        Product Attributes
      </Typography>

      <Box display="flex" flexDirection="column" gap={2} mb={2}>
        {Array.from({
          length: Math.ceil(productLevelAttributes.length / 2),
        }).map((_, rowIdx) => (
          <Box key={rowIdx} display="flex" gap={2} mb={2}>
            {productLevelAttributes
              .slice(rowIdx * 2, rowIdx * 2 + 2)
              .map((attr, indexInRow) => {
                const globalIndex = rowIdx * 2 + indexInRow;
                return (
                  <Box key={attr._id} minWidth={250} flex={1}>
          <Controller
                      name={`productAttributes.${globalIndex}.attributeId`}
            control={control}
                      defaultValue={attr._id}
                      render={({ field }) => <input type="hidden" {...field} />}
          />
          <Controller
                      name={`productAttributes.${globalIndex}.value`}
            control={control}
                      render={({ field }) => {
                        if (attr.inputType === "text") {
                          return (
                            <TextField
                              {...field}
                              label={attr.name}
                              fullWidth
                              sx={{ mb: 2 }}
                              value={field.value ?? ""}
                            />
                          );
                        }
                        if (
                          attr.inputType === "dropdown" ||
                          attr.inputType === "multi-select"
                        ) {
                          return (
                            <TextField
                              {...field}
                              select
                              label={attr.name}
                              fullWidth
                              sx={{ mb: 2 }}
                              value={field.value ?? ""}
                            >
                              {(attr.options || []).map((opt) => (
                                <MenuItem key={opt} value={opt}>
                                  {opt}
                                </MenuItem>
                              ))}
                            </TextField>
                          );
                        }
                        if (attr.inputType === "file") {
                          return (
                            <Box mb={2}>
                              <Typography
                                fontSize={13}
                                fontWeight={500}
                                mb={0.5}
                              >
                                {attr.name}
                              </Typography>
                              <input
                                type="file"
                                accept="*/*"
                                onChange={(e) =>
                                  field.onChange(e.target.files?.[0])
                                }
                                value={undefined}
                              />
                              {/* {field.value && field.value instanceof File && (
                                <Box mt={1}>
                                  <Typography fontSize={12}>
                                    Selected: {field.value.name}
                                  </Typography>
                                </Box>
                              )} */}
                            </Box>
                          );
                        }
                        // Fallback for missing or unknown inputType
                        return (
                          <Typography color="error" fontSize={12}>
                            Unknown or missing inputType for attribute:{" "}
                            {attr.name}
                          </Typography>
                        );
                      }}
                    />
                  </Box>
                );
              })}
        </Box>
      ))}
      </Box>

      {/* Variants Section */}
      <Typography variant="h6" mt={4} mb={2}>
        Variants
      </Typography>

      <VariantForm
        key={variantFields.length + JSON.stringify(form.getValues("variants"))}
        fields={variantFields}
        append={appendVariant}
        remove={removeVariant}
        control={control}
        errors={form.formState.errors}
        variantAttributes={variantLevelAttributes}  
        inventories={inventories}
      />

      <Button
        type="submit"
        variant="contained"
        color="primary"
        disabled={isSubmitting}
        fullWidth
      >
        {isSubmitting ? "Submitting..." : "Submit"}
      </Button>
    </Box>
  );
}
