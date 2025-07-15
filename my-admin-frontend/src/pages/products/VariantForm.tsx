import {
  Box,
  Button,
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
  inventories: { _id: string; sku: string }[]; 
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
  inventory: z.string().min(1),
  attributes: z.array(attributeValueSchema),
});

const VariantForm: React.FC<VariantFormProps> = ({
  fields,
  append,
  remove,
  control,
  variantAttributes,
  inventories,
}) => {
  return (
    <>
      {/* {console.log('variantAttributes', variantAttributes)} */}
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
                  value={field.value ?? ""}
                  onChange={e => field.onChange(e.target.value === "" ? "" : Number(e.target.value))}
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
                  value={field.value ?? ""}
                  onChange={e => field.onChange(e.target.value === "" ? "" : Number(e.target.value))}
                />
              )}
            />
          </Box>

          {/* Replace Inventory fields with Inventory reference select */}
          <Box display="flex" gap={2} mb={2}>
            <Controller
              name={`variants.${index}.inventory`}
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  select
                  label="Inventory Reference"
                  fullWidth
                  value={field.value ?? ''}
                >
                  <MenuItem value="" disabled>Select Inventory</MenuItem>
                  {inventories.map(inv => (
                    <MenuItem key={inv._id} value={inv._id}>{inv.sku}</MenuItem>
                  ))}
                </TextField>
              )}
            />
          </Box>

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
          <Typography variant="subtitle2" mt={2} mb={1}>
            Attributes
          </Typography>

          <Box mb={2}>
            {Array.from({ length: Math.ceil(variantAttributes.length / 2) }).map((_, rowIdx) => (
              <Box key={rowIdx} display="flex" gap={2} mb={2}>
                {variantAttributes.slice(rowIdx * 2, rowIdx * 2 + 2).map((attr, attrIndex) => {
                  const globalAttrIndex = rowIdx * 2 + attrIndex;
                  return (
                    <Box key={attr._id} minWidth={250} flex={1}>
                      {/* Register attributeId using Controller */}
                      <Controller
                        name={`variants.${index}.attributes.${globalAttrIndex}.attributeId`}
                        control={control}
                        defaultValue={attr._id}
                        render={({ field }) => <input type="hidden" {...field} />}
                      />
                      <Controller
                        name={`variants.${index}.attributes.${globalAttrIndex}.value`}
                        control={control}
                        render={({ field }) => {
                          if (attr.inputType === "text") {
                            return (
                              <TextField
                                {...field}
                                label={attr.name}
                                fullWidth
                                sx={{ mb: 2 }}
                              />
                            );
                          }
                          if (attr.inputType === "dropdown" || attr.inputType === "multi-select") {
                            return (
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
                            );
                          }
                          if (attr.inputType === "file") {
                            return (
                              <Box mb={2}>
                                <Typography fontSize={13} fontWeight={500} mb={0.5}>
                                  {attr.name}
                                </Typography>
                                <input
                                  type="file"
                                  accept="*/*"
                                  onChange={(e) => field.onChange(e.target.files?.[0])}
                                />
                              </Box>
                            );
                          }
                          // Fallback for missing or unknown inputType
                          return (
                            <Typography color="error" fontSize={12}>
                              Unknown or missing inputType for attribute: {attr.name}
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

          {/* Remove Variant Button: Only show if more than one variant */}
          {fields.length > 1 && (
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
          )}  
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
            images: [],
            attributes: variantAttributes.map((attr) => ({
              attributeId: attr._id,
              value: "",
            })),
            inventory: {
              sku: "",
              quantity: 0,
              allowBackorder: false,
              lowStockThreshold: 5,
            },
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
