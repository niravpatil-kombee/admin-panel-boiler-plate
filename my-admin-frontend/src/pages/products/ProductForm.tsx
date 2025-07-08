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
import type { Category, Brand } from "../../types/product";
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

const productSchema = z.object({
  name: z.string().min(1, "Name is required"),
  slug: z.string().min(1, "Slug is required"),
  category: z.string().min(1, "Category is required"),
  brand: z.string().min(1, "Brand is required"),
  description: z.string().optional(),
  attributes: z
    .array(z.object({ key: z.string(), value: z.string() }))
    .optional(),
  variants: z
    .array(
      z.object({
        sku: z.string(),
        size: z.string(),
        color: z.string(),
        images: z.array(z.union([z.string(), z.instanceof(File)])).optional(),
        price: z.object({
          base: z.number(),
          discount: z.number(),
          discountType: z.enum(["flat", "percentage"]),
          finalPrice: z.number(),
        }),
        inventory: z.object({
          quantity: z.number(),
          lowStockThreshold: z.number().optional(),
          allowBackorders: z.boolean(),
        }),
        stockAvailable: z.boolean(),
        attributes: z.array(z.object({ key: z.string(), value: z.string() })),
      })
    )
    .optional(),
});

type ProductFormSchema = z.infer<typeof productSchema>;

export default function ProductFormPage() {
  const { id } = useParams<{ id: string }>();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);

  const form = useForm<ProductFormSchema>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: "",
      slug: "",
      description: "",
      category: "",
      brand: "",
      attributes: [],
      variants: [],
    },
  });

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

  const {
    fields: attributeFields,
    append: appendAttribute,
    remove: removeAttribute,
  } = useFieldArray({ control, name: "attributes" });

  useEffect(() => {
    getCategoriesAPI().then((data) => setCategories(data.categories));
    getBrandsAPI().then((data) => setBrands(data.brands));

    if (isEdit && id) {
      setLoading(true);
      getProductByIdAPI(id)
        .then((product) => {
          if (!product) throw new Error("Product not found");
          reset({
            ...product,
            variants: (product.variants ?? []).map((v: any) => ({
              sku: v.sku,
              size: v.size ?? "",
              color: v.color ?? "",
              images: v.images ?? [],
              price: {
                base: v.price?.base ?? 0,
                discount: v.price?.discount ?? 0,
                discountType: v.price?.discountType ?? "flat",
                finalPrice: v.price?.finalPrice ?? 0,
              },
              inventory: {
                quantity: v.inventory?.quantity ?? 0,
                lowStockThreshold: v.inventory?.lowStockThreshold ?? 5,
                allowBackorders: v.inventory?.allowBackorders ?? false,
              },
              stockAvailable: v.stockAvailable ?? true,
              attributes: v.attributes ?? [],
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
      formData.append("brand", data.brand ?? "");
      formData.append("description", data.description ?? "");
      formData.append("attributes", JSON.stringify(data.attributes ?? []));

      const variantPayload =
        data.variants?.map((variant, idx) => {
          if (variant.images && Array.isArray(variant.images)) {
            variant.images.forEach((file, fileIndex) => {
              formData.append(`variantImages_${idx}_${fileIndex}`, file);
            });
          }

          return {
            ...variant,
            images: (variant.images ?? []).map(
              (_: any, fileIndex: number) => `variantImages_${idx}_${fileIndex}`
            ),
          };
        }) ?? [];

      formData.append("variants", JSON.stringify(variantPayload));

      if (isEdit && id) await updateProductAPI(id, formData);
      else await createProductAPI(formData);

      navigate("/products");
    } catch (err) {
      alert("Failed to create/update product. See console for details.");
      console.error(err);
    }
  };

  if (loading)
    return (
      <Box textAlign="center" mt={4}>
        <CircularProgress />
      </Box>
    );

  return (
    <Box
      maxWidth="sm"
      mx="auto"
      p={4}
      component="form"
      onSubmit={handleSubmit(onSubmit)}
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

      {/* Attributes Section */}
      <Typography variant="h6" mt={4} mb={1}>
        Product Attributes
      </Typography>

      {attributeFields.map((item, index) => (
        <Box key={item.id} display="flex" gap={2} mb={2}>
          <Controller
            name={`attributes.${index}.key`}
            control={control}
            render={({ field }) => (
              <TextField {...field} label="Key" fullWidth />
            )}
          />
          <Controller
            name={`attributes.${index}.value`}
            control={control}
            render={({ field }) => (
              <TextField {...field} label="Value" fullWidth />
            )}
          />
          <Button
            variant="outlined"
            color="error"
            onClick={() => removeAttribute(index)}
          >
            Remove
          </Button>
        </Box>
      ))}

      <Button
        variant="contained"
        onClick={() => appendAttribute({ key: "", value: "" })}
        sx={{ mb: 2 }}
      >
        Add Attribute
      </Button>

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
        variantAttributes={[]}
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
