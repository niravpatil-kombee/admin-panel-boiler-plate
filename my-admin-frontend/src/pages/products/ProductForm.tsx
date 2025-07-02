import { useForm, useFieldArray, Controller } from "react-hook-form";
import {
  Box,
  Button,
  Checkbox,
  CircularProgress,
  FormControlLabel,
  MenuItem,
  TextField,
  Typography,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
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
        images: z.array(z.string()),
        price: z.object({
          base: z.number(),
          discount: z.number(),
          discountType: z.enum(["flat", "percentage"]),
          finalPrice: z.number(),
        }),
        inventory: z.object({
          quantity: z.number(),
          lowStockThreshold: z.number(),
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
    try {
      console.log("Form submitted", data);
      const formData = new FormData();
      formData.append("title", data.title);
      formData.append("slug", data.slug);
      formData.append("category", data.category);
      formData.append("brand", data.brand ?? "");
      formData.append("description", data.description ?? "");
      formData.append("attributes", JSON.stringify(data.attributes ?? []));
      formData.append("variants", JSON.stringify(data.variants ?? []));
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

      {variantFields.map((variant, index) => (
        <Box
          key={variant.id}
          mb={3}
          p={2}
          border={1}
          borderColor="grey.300"
          borderRadius={2}
        >
          <Typography variant="subtitle2" mb={1}>
            Variant #{index + 1}
          </Typography>

          <Controller
            name={`variants.${index}.sku`}
            control={control}
            render={({ field }) => (
              <TextField {...field} label="SKU" fullWidth sx={{ mb: 2 }} />
            )}
          />

          <Controller
            name={`variants.${index}.size`}
            control={control}
            render={({ field }) => (
              <TextField {...field} label="Size" fullWidth sx={{ mb: 2 }} />
            )}
          />

          <Controller
            name={`variants.${index}.color`}
            control={control}
            render={({ field }) => (
              <TextField {...field} label="Color" fullWidth sx={{ mb: 2 }} />
            )}
          />
          <Controller
            name={`variants.${index}.price.base`}
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Base Price"
                type="number"
                fullWidth
                sx={{ mb: 2 }}
                onChange={(e) =>
                  field.onChange(
                    e.target.value === "" ? undefined : +e.target.value
                  )
                }
              />
            )}
          />

          <Controller
            name={`variants.${index}.price.discount`}
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Discount"
                type="number"
                fullWidth
                sx={{ mb: 2 }}
                onChange={(e) =>
                  field.onChange(
                    e.target.value === "" ? undefined : +e.target.value
                  )
                }
              />
            )}
          />

          <Controller
            name={`variants.${index}.price.discountType`}
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Discount Type"
                select
                fullWidth
                sx={{ mb: 2 }}
              >
                <MenuItem value="flat">Flat</MenuItem>
                <MenuItem value="percentage">Percentage</MenuItem>
              </TextField>
            )}
          />

          <Controller
            name={`variants.${index}.price.finalPrice`}
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Final Price"
                type="number"
                fullWidth
                sx={{ mb: 2 }}
                onChange={(e) =>
                  field.onChange(
                    e.target.value === "" ? undefined : +e.target.value
                  )
                }
              />
            )}
          />

          <Controller
            name={`variants.${index}.inventory.quantity`}
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Quantity"
                type="number"
                fullWidth
                sx={{ mb: 2 }}
                onChange={(e) =>
                  field.onChange(
                    e.target.value === "" ? undefined : +e.target.value
                  )
                }
              />
            )}
          />

          <Controller
            name={`variants.${index}.inventory.lowStockThreshold`}
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Low Stock Threshold"
                type="number"
                fullWidth
                sx={{ mb: 2 }}
              />
            )}
          />

          <Controller
            name={`variants.${index}.inventory.allowBackorders`}
            control={control}
            render={({ field }) => (
              <FormControlLabel
                control={<Checkbox {...field} checked={field.value} />}
                label="Allow Backorders"
              />
            )}
          />

          <Button
            onClick={(e) => {
              e.preventDefault();
              removeVariant(index);
            }}
            color="error"
            variant="outlined"
          >
            Remove Variant
          </Button>
        </Box>
      ))}

      <Button
        onClick={(e) => {
          e.preventDefault();
          appendVariant({
            sku: "SKU-" + Date.now(),
            size: "",
            color: "",
            price: {
              base: 0,
              discount: 0,
              discountType: "flat",
              finalPrice: 0,
            },
            inventory: {
              quantity: 0,
              lowStockThreshold: 5,
              allowBackorders: false,
            },
            stockAvailable: true,
            images: [],
            attributes: [],
          });
        }}
        startIcon={<AddIcon />}
        sx={{ mb: 3 }}
      >
        Add Variant
      </Button>

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
