import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  MenuItem,
  TextField,
  Typography,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { Controller } from "react-hook-form";
import type { Control, FieldErrors } from "react-hook-form";
import React from "react";
import { z } from "zod";
import type { Attribute } from "../../types/product";

interface VariantFormProps {
  fields: any[];
  append: (value: any) => void;
  remove: (index: number) => void;
  control: Control<any>;
  errors: FieldErrors<any>;
  variantAttributes: Attribute[];
}

export const attributeValueSchema = z.object({
  attributeId: z.string().min(1),
  value: z.union([z.string().min(1), z.instanceof(File)]),
});

export const inventorySchema = z.object({
  sku: z.string().min(1),
  quantity: z.coerce.number().nonnegative(),
  lowStockThreshold: z.coerce.number().optional(),
  allowBackorder: z.boolean().optional(),
});

export const variantSchema = z.object({
  name: z.string().min(1),
  sku: z.string().min(1),
  price: z.coerce.number().nonnegative(),
  stock: z.coerce.number().nonnegative(),
  images: z.any().optional(),
  inventory: inventorySchema,
  attributes: z.array(attributeValueSchema),
});

const VariantForm: React.FC<VariantFormProps> = ({
  fields,
  append,
  remove,
  control,
  variantAttributes,
}) => {
  return (
    <>
      {fields.map((variant, index) => (
        <Box
          key={variant.id || index}
          mb={3}
          p={2}
          border={1}
          borderColor="grey.300"
          borderRadius={2}
        >
          <Typography variant="subtitle2" mb={2}>
            Variant #{index + 1}
          </Typography>

          {/* Name + SKU */}
          <Box display="flex" gap={2} mb={2}>
            <Controller
              name={`variants.${index}.name`}
              control={control}
              render={({ field }) => (
                <TextField {...field} label="Variant Name" fullWidth />
              )}
            />
            <Controller
              name={`variants.${index}.sku`}
              control={control}
              render={({ field }) => (
                <TextField {...field} label="SKU" fullWidth />
              )}
            />
          </Box>

          {/* Price + Stock */}
          <Box display="flex" gap={2} mb={2}>
            <Controller
              name={`variants.${index}.price`}
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Price"
                  type="number"
                  fullWidth
                />
              )}
            />
            <Controller
              name={`variants.${index}.stock`}
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Stock"
                  type="number"
                  fullWidth
                />
              )}
            />
          </Box>

          <Typography variant="subtitle2" mt={2} mb={1}>
            Inventory
          </Typography>

          {/* Inventory SKU + Quantity */}
          <Box display="flex" gap={2} mb={2}>
            <Controller
              name={`variants.${index}.inventory.sku`}
              control={control}
              render={({ field }) => (
                <TextField {...field} label="Inventory SKU" fullWidth />
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
                />
              )}
            />
          </Box>

          {/* Low Threshold + Backorder */}
          <Box display="flex" gap={2} alignItems="center" mb={2}>
            <Controller
              name={`variants.${index}.inventory.lowStockThreshold`}
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Low Stock Threshold"
                  type="number"
                  fullWidth
                />
              )}
            />
            <Controller
              name={`variants.${index}.inventory.allowBackorder`}
              control={control}
              render={({ field }) => (
                <FormControlLabel
                  control={<Checkbox {...field} checked={field.value} />}
                  label="Allow Backorders"
                />
              )}
            />
          </Box>

          {/* Images */}
          <Typography variant="subtitle2" mt={2}>
            Images
          </Typography>
          <Controller
            name={`variants.${index}.images`}
            control={control}
            render={({ field }) => (
              <Box mb={2}>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={(e) => field.onChange(Array.from(e.target.files || []))}
                />
                <Box mt={1} display="flex" gap={1} flexWrap="wrap">
                  {Array.isArray(field.value) &&
                    field.value.map((img: string | File, i: number) => {
                      const src = img instanceof File ? URL.createObjectURL(img) : img;
                      return (
                        <img
                          key={i}
                          src={src}
                          alt={`preview-${i}`}
                          style={{
                            width: 80,
                            height: 80,
                            objectFit: "cover",
                            borderRadius: 4,
                            border: "1px solid #ccc",
                          }}
                        />
                      );
                    })}
                </Box>
              </Box>
            )}
          />

          {/* Attributes */}
          <Typography variant="subtitle2" mt={2}>
            Attributes
          </Typography>
          <Box display="flex" gap={2} flexWrap="wrap" mb={2}>
            {variantAttributes.map((attr, attrIndex) => (
              <Controller
                key={attr._id}
                name={`variants.${index}.attributes.${attrIndex}.value`}
                control={control}
                render={({ field }) => (
                  <Box minWidth={250}>
                    <input
                      type="hidden"
                      value={attr._id}
                      {...control.register(
                        `variants.${index}.attributes.${attrIndex}.attributeId`
                      )}
                    />
                    {attr.inputType === "text" && (
                      <TextField {...field} label={attr.name} fullWidth sx={{ mb: 2 }} />
                    )}
                    {(attr.inputType === "dropdown" ||
                      attr.inputType === "multi-select") && (
                      <TextField
                        {...field}
                        select
                        label={attr.name}
                        fullWidth
                        sx={{ mb: 2 }}
                      >
                        {attr.options?.map((opt: string) => (
                          <MenuItem key={opt} value={opt}>
                            {opt}
                          </MenuItem>
                        ))}
                      </TextField>
                    )}
                    {attr.inputType === "file" && (
                      <input
                        type="file"
                        accept="*/*"
                        onChange={(e) => field.onChange(e.target.files?.[0])}
                      />
                    )}
                  </Box>
                )}
              />
            ))}
          </Box>

          <Button
            onClick={(e) => {
              e.preventDefault();
              remove(index);
            }}
            color="error"
            variant="outlined"
            sx={{ mt: 1 }}
          >
            Remove Variant
          </Button>
        </Box>
      ))}

      <Button
        onClick={(e) => {
          e.preventDefault();
          append({
            name: "",
            sku: "",
            price: 0,
            stock: 0,
            inventory: {
              sku: "",
              quantity: 0,
              allowBackorder: false,
              lowStockThreshold: 5,
            },
            images: [],
            attributes: variantAttributes.map((attr) => ({
              attributeId: attr._id,
              value: "",
            })),
          });
        }}
        startIcon={<AddIcon />}
        variant="outlined"  
        sx={{ mb: 3 }}
      >
        Add Variant
      </Button>
    </>
  );
};

export default VariantForm;
