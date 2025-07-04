import { Box, Button, Checkbox, FormControlLabel, MenuItem, TextField, Typography } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { Controller } from "react-hook-form";
import type { Control, FieldErrors } from "react-hook-form";
import React from "react";

interface VariantFormProps {
  fields: any[];
  append: (value: any) => void;
  remove: (index: number) => void;
  control: Control<any>;
  errors: FieldErrors<any>;
}

const VariantForm: React.FC<VariantFormProps> = ({ fields, append, remove, control, errors }) => {
  return (
    <>
      {fields.map((variant, index) => (
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
          <Controller
            name={`variants.${index}.images`}
            control={control}
            render={({ field }) => (
              <Box mb={2}>
                <Typography variant="subtitle2">Variant Images</Typography>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={(e) => {
                    const files = Array.from(e.target.files || []);
                    const imagePaths = files.map((file) => URL.createObjectURL(file));
                    field.onChange(imagePaths);
                  }}
                />
              </Box>
            )}
          />

          <Button
            onClick={(e) => {
              e.preventDefault();
              remove(index);
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
          append({
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
    </>
  );
};

export default VariantForm; 