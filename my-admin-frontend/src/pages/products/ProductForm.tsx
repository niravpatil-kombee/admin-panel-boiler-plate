import { useForm, useFieldArray, Controller } from "react-hook-form";
import {
  Box,
  Button,
  Checkbox,
  CircularProgress,
  FormControlLabel,
  IconButton,
  MenuItem,
  TextField,
  Typography,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import type { Product, Category, Brand } from "../../types/product";
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
  name: z.string().min(1, "Name is required"),
  slug: z.string().min(1, "Slug is required"),
  category: z.string().min(1, "Category is required"),
  brand: z.string().optional(),
  description: z.string().optional(),
  price: z.object({
    base: z.number().min(0, "Base price is required"),
    discount: z.number().optional(),
    tiered: z.array(z.object({
      minQty: z.number().optional(),
      price: z.number().optional(),
    })).optional(),
  }),
  inventory: z.object({
    quantity: z.number().min(0, "Quantity is required"),
    sku: z.string().optional(),
    lowStockThreshold: z.number().optional(),
    warehouseLocation: z.string().optional(),
  }),
  tags: z.array(z.string()).optional(),
  attributes: z.array(z.object({ key: z.string(), value: z.string() })).optional(),
  variants: z.array(z.any()).optional(),
  isActive: z.boolean().optional(),
  isFeatured: z.boolean().optional(),
  availableFrom: z.string().optional(),
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
      name: "",
      slug: "",
      description: "",
      category: "",
      brand: "",
      tags: [],
      attributes: [{ key: "", value: "" }],
      variants: [],
      price: { base: 0, discount: 0, tiered: [] },
      inventory: {
        quantity: 0,
        sku: "",
        lowStockThreshold: 0,
        warehouseLocation: "",
      },
      isActive: true,
      isFeatured: false,
      availableFrom: "",
    },
  });

  const {
    control,
    handleSubmit,
    reset,
    formState: { isSubmitting, errors },
  } = form;

  const {
    fields: attributeFields,
    append: appendAttribute,
    remove: removeAttribute,
  } = useFieldArray({ control, name: "attributes" });

  const {
    fields: tieredFields,
    append: appendTiered,
    remove: removeTiered,
  } = useFieldArray({ control, name: "price.tiered" });

  useEffect(() => {
    getCategoriesAPI().then((data) => setCategories(data.categories));
    getBrandsAPI().then((data) => setBrands(data.brands));
    if (isEdit && id) {
      setLoading(true);
      getProductByIdAPI(id)
        .then((product) =>
          reset({ ...product, availableFrom: product.availableFrom ?? "" })
        )
        .finally(() => setLoading(false));
    }
  }, [id, isEdit, reset]);

  const onSubmit = async (data: ProductFormSchema) => {
    const cleanedAttributes = (data.attributes ?? []).filter(
      (attr) => attr.key.trim() !== "" && attr.value.trim() !== ""
    );

    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("slug", data.slug);
    formData.append("category", data.category);
    formData.append("brand", data.brand ?? "");
    formData.append("description", data.description ?? "");
    formData.append("tags", JSON.stringify(data.tags ?? []));
    formData.append("attributes", JSON.stringify(cleanedAttributes));
    formData.append(
      "price",
      JSON.stringify({
        base: Number(data.price.base),
        discount: Number(data.price.discount),
        tiered: (data.price.tiered ?? []).map((t) => ({
          minQty: Number(t.minQty),
          price: Number(t.price),
        })),
      })
    );
    formData.append(
      "inventory",
      JSON.stringify({
        quantity: Number(data.inventory.quantity),
        sku: data.inventory.sku,
        lowStockThreshold: Number(data.inventory.lowStockThreshold),
        warehouseLocation: data.inventory.warehouseLocation,
      })
    );
    formData.append("isActive", (data.isActive ?? true).toString());
    formData.append("isFeatured", (data.isFeatured ?? false).toString());
    formData.append("availableFrom", data.availableFrom ?? "");
    if (imageFile) {
      formData.append("image", imageFile);
    }

    if (isEdit && id) await updateProductAPI(id, formData);
    else await createProductAPI(formData);

    navigate("/products");
  };

  if (loading)
    return (
      <Box textAlign="center" mt={4}>
        <CircularProgress />
      </Box>
    );

  return (
    <Box maxWidth="sm" mx="auto" p={4} component="form" onSubmit={handleSubmit(onSubmit)}>
      <Typography variant="h4" gutterBottom>
        {isEdit ? "Edit Product" : "Create Product"}
      </Typography>

      {/* Name */}
      <Controller
        name="name"
        control={control}
        render={({ field }) => (
          <TextField {...field} label="Product Name" fullWidth sx={{ mb: 2 }} />
        )}
      />

      {/* Slug */}
      <Controller
        name="slug"
        control={control}
        render={({ field }) => (
          <TextField {...field} label="Slug" fullWidth sx={{ mb: 2 }} />
        )}
      />

      {/* Category */}
      <Controller
        name="category"
        control={control}
        render={({ field }) => (
          <TextField {...field} label="Category" select fullWidth sx={{ mb: 2 }}>
            {categories.map((cat) => (
              <MenuItem key={cat._id} value={cat._id}>
                {cat.name}
              </MenuItem>
            ))}
          </TextField>
        )}
      />

      {/* Brand */}
      <Controller
        name="brand"
        control={control}
        render={({ field }) => (
          <TextField {...field} label="Brand" select fullWidth sx={{ mb: 2 }}>
            {brands.map((brand) => (
              <MenuItem key={brand._id} value={brand._id}>
                {brand.name}
              </MenuItem>
            ))}
          </TextField>
        )}
      />

      {/* Description */}
      <Controller
        name="description"
        control={control}
        render={({ field }) => (
          <TextField {...field} label="Description" multiline rows={3} fullWidth sx={{ mb: 2 }} />
        )}
      />

      {/* Date Picker */}
      <Controller
        name="availableFrom"
        control={control}
        render={({ field }) => (
          <DatePicker
            label="Available From"
            value={field.value ? new Date(field.value) : null}
            onChange={(val) => field.onChange(val ? val.toISOString() : "")}
            slotProps={{ textField: { fullWidth: true, sx: { mb: 2 } } }}
          />
        )}
      />

      {/* Price */}
      <Controller
        name="price.base"
        control={control}
        render={({ field }) => (
          <TextField {...field} type="number" label="Base Price" fullWidth sx={{ mb: 2 }} />
        )}
      />
      <Controller
        name="price.discount"
        control={control}
        render={({ field }) => (
          <TextField {...field} type="number" label="Discount Price" fullWidth sx={{ mb: 2 }} />
        )}
      />

      {/* Tiered Pricing */}
      <Box mb={2}>
        <Typography variant="subtitle1">Tiered Pricing</Typography>
        {tieredFields.map((item, index) => (
          <Box key={item.id} display="flex" gap={1} mb={1}>
            <Controller
              name={`price.tiered.${index}.minQty`}
              control={control}
              render={({ field }) => (
                <TextField {...field} label="Min Qty" type="number" />
              )}
            />
            <Controller
              name={`price.tiered.${index}.price`}
              control={control}
              render={({ field }) => (
                <TextField {...field} label="Price" type="number" />
              )}
            />
            <IconButton onClick={(e) => { e.preventDefault(); removeTiered(index); }}>
              <DeleteIcon />
            </IconButton>
          </Box>
        ))}
        <IconButton onClick={(e) => { e.preventDefault(); appendTiered({ minQty: 0, price: 0 }); }}>
          <AddIcon />
        </IconButton>
      </Box>

      {/* Inventory */}
      <Typography variant="subtitle1" sx={{ mb: 1 }}>Inventory</Typography>
      <Controller
        name="inventory.quantity"
        control={control}
        render={({ field }) => (
          <TextField {...field} type="number" label="Stock Quantity" fullWidth sx={{ mb: 2 }} />
        )}
      />
      <Controller
        name="inventory.sku"
        control={control}
        render={({ field }) => (
          <TextField {...field} label="SKU" fullWidth sx={{ mb: 2 }} />
        )}
      />
      <Controller
        name="inventory.lowStockThreshold"
        control={control}
        render={({ field }) => (
          <TextField {...field} type="number" label="Low Stock Threshold" fullWidth sx={{ mb: 2 }} />
        )}
      />
      <Controller
        name="inventory.warehouseLocation"
        control={control}
        render={({ field }) => (
          <TextField {...field} label="Warehouse Location" fullWidth sx={{ mb: 2 }} />
        )}
      />

      {/* Attributes */}
      <Typography variant="subtitle1" sx={{ mt: 3 }}>Attributes</Typography>
      {attributeFields.map((item, index) => (
        <Box key={item.id} display="flex" gap={1} mb={1}>
          <Controller
            name={`attributes.${index}.key`}
            control={control}
            render={({ field }) => (
              <TextField {...field} label="Key" error={!!errors.attributes?.[index]?.key} helperText={errors.attributes?.[index]?.key?.message} />
            )}
          />
          <Controller
            name={`attributes.${index}.value`}
            control={control}
            render={({ field }) => (
              <TextField {...field} label="Value" error={!!errors.attributes?.[index]?.value} helperText={errors.attributes?.[index]?.value?.message} />
            )}
          />
          <IconButton onClick={(e) => { e.preventDefault(); removeAttribute(index); }}>
            <DeleteIcon />
          </IconButton>
        </Box>
      ))}
      <IconButton onClick={(e) => { e.preventDefault(); appendAttribute({ key: "", value: "" }); }}>
        <AddIcon />
      </IconButton>

      {/* Image Upload */}
      <Box mt={3} mb={2}>
        <Typography variant="subtitle1">Product Image</Typography>
        <input
          type="file"
          accept="image/*"
          onChange={e => {
            const file = e.target.files?.[0] || null;
            setImageFile(file);
            if (file) {
              const reader = new FileReader();
              reader.onload = ev => setImagePreview(ev.target?.result as string);
              reader.readAsDataURL(file);
            } else {
              setImagePreview(null);
            }
          }}
        />
        {imagePreview && (
          <Box mt={1}>
            <img src={imagePreview} alt="Preview" style={{ maxWidth: 200, maxHeight: 200 }} />
          </Box>
        )}
      </Box>

      <FormControlLabel
        control={<Controller name="isActive" control={control} render={({ field }) => <Checkbox {...field} checked={field.value} />} />}
        label="Active"
      />
      <FormControlLabel
        control={<Controller name="isFeatured" control={control} render={({ field }) => <Checkbox {...field} checked={field.value} />} />}
        label="Featured"
      />

      <Button type="submit" variant="contained" color="primary" disabled={isSubmitting} fullWidth sx={{ mt: 2 }}>
        {isSubmitting ? "Submitting..." : "Submit"}
      </Button>
    </Box>
  );
}
