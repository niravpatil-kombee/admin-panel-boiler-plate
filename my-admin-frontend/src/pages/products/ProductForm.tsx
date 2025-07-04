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
  title: z.string().min(1, "Title is required"),
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
        sku: z.string().min(1, "SKU is required"),
        size: z.string(),
        color: z.string(),
        images: z.array(z.union([z.string(), z.instanceof(File)])), 
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
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const form = useForm<ProductFormSchema>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      title: "",
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

  useEffect(() => {
    getCategoriesAPI().then((data) => setCategories(data.categories));
    getBrandsAPI().then((data) => setBrands(data.brands));
    if (isEdit && id) {
      setLoading(true);
      getProductByIdAPI(id)
        .then((product) => {
          reset({
            ...product,
            variants:
              product.variants?.map((v: any) => ({
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
              })) ?? [],
          });
        })
        .finally(() => setLoading(false));
    }
  }, [id, isEdit, reset]);

  const onSubmit = async (data: ProductFormSchema) => {
    console.log("Form data:", data);
    try {
      const formData = new FormData();

      formData.append("title", data.title);
      formData.append("slug", data.slug);
      formData.append("category", data.category);
      formData.append("brand", data.brand ?? "");
      formData.append("description", data.description ?? "");
      formData.append("attributes", JSON.stringify(data.attributes ?? []));

      // Transform variants before appending
      const variantPayload =
        data.variants?.map((variant, idx) => {
          // Append each image file to FormData
          if (variant.images && Array.isArray(variant.images)) {
            variant.images.forEach((file, fileIndex) => {
              formData.append(`variantImages_${idx}_${fileIndex}`, file); // backend must support this
            });
          }

          return {
            ...variant,
            images: variant.images.map(
              (_, fileIndex) => `variantImages_${idx}_${fileIndex}`
            ),
          };
        }) ?? [];

      formData.append("variants", JSON.stringify(variantPayload));

      if (imageFile) formData.append("mainImage", imageFile);

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
      onSubmit={handleSubmit(onSubmit, (errors) => {
        console.error("Validation errors:", errors);
        alert(JSON.stringify(errors, null, 2));
      })}
    >
      <Typography variant="h4" gutterBottom>
        {isEdit ? "Edit Product" : "Create Product"}
      </Typography>

      <Controller
        name="title"
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            label="Title"
            fullWidth
            sx={{ mb: 2 }}
            error={!!form.formState.errors.title}
            helperText={form.formState.errors.title?.message}
          />
        )}
      />

      <Controller
        name="slug"
        control={control}
        render={({ field }) => (
          <TextField {...field} label="Slug" fullWidth sx={{ mb: 2 }} />
        )}
      />

      <Controller
        name="category"
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            label="Category"
            select
            fullWidth
            sx={{ mb: 2 }}
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
            sx={{ mb: 2 }}
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

      <Box mt={3} mb={2}>
        <Typography variant="subtitle1">Main Image</Typography>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => {
            const file = e.target.files?.[0] || null;
            setImageFile(file);
            if (file) {
              const reader = new FileReader();
              reader.onload = (ev) =>
                setImagePreview(ev.target?.result as string);
              reader.readAsDataURL(file);
            } else {
              setImagePreview(null);
            }
          }}
        />
        {imagePreview && (
          <Box mt={1}>
            <img
              src={imagePreview}
              alt="Preview"
              style={{ maxWidth: 200, maxHeight: 200 }}
            />
          </Box>
        )}
      </Box>

      <Typography variant="h6" mt={4} mb={2}>
        Variants
      </Typography>

      <VariantForm
        fields={variantFields}
        append={appendVariant}
        remove={removeVariant}
        control={control}
        errors={form.formState.errors}
        isEdit={isEdit}
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
