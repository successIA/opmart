import React from "react";
import { v4 as uuidv4 } from "uuid";
import { useHistory } from "react-router-dom";
import { useSnackbar } from "notistack";
import {
  Box,
  Button,
  Container,
  Grid,
  MenuItem,
  styled,
  Typography,
  FormHelperText,
  IconButton,
} from "@mui/material";
import { grey } from "@mui/material/colors";
import { Image } from "react-feather";
import { useFormik } from "formik";

import TextField from "../../components/TextField";
import * as Yup from "yup";
import { X as IconX } from "react-feather";
import { useCategoriesQuery } from "../categories/queries";
import CircularProgress from "../../components/CircularProgress";
import { uploadListingImage } from "./upload";
import { useListingCreateMutation } from "./queries";

const Input = styled("input")({
  display: "none",
});

const validationSchema = Yup.object({
  selectedImages: Yup.array()
    .required("Required")
    .min(1, "Minimum of 1 image")
    .max(10, "Maximum of 2 images"),
  title: Yup.string().required("Required").min(10, "Minimum of 10 characters"),
  price: Yup.number("A valid number is required")
    .required("Required")
    .min(1, "Price must be greater or equal to 1"),
  category: Yup.number().required("Required"),
  condition: Yup.string().required("Required"),
  description: Yup.string().required("Required"),
});

const UploadStatus = {
  IDLE: 0,
  PENDING: 1,
  SUCCESS: 2,
};

const MAX_IMAGE_COUNT = 10;
const MAX_IMAGE_SIZE_UNIT = 1024 * 1024;
const MAX_IMAGE_SIZE = 5 * MAX_IMAGE_SIZE_UNIT;

function imageUploadReducer(state, action) {
  switch (action.type) {
    case "IMAGES_ADDED":
      return [...state, ...action.payload];
    case "IMAGE_LOADED":
      return state.map((img) => {
        if (img.key === action.payload.key) {
          return {
            ...img,
            loaded: true,
            status: UploadStatus.PENDING,
          };
        }
        return img;
      });
    case "IMAGE_UPLOADED":
      return state.map((img) => {
        if (img.key === action.payload.key) {
          return {
            ...img,
            status: UploadStatus.SUCCESS,
            id: action.payload.id,
          };
        }
        return img;
      });
    case "IMAGE_REMOVED":
      return state.filter((img) => img.key !== action.payload);
    default:
      throw new Error(`Unhandled type ${action.type}`);
  }
}

function AddListing() {
  const { data: categories } = useCategoriesQuery();
  const { mutate, isLoading } = useListingCreateMutation();
  const history = useHistory();
  const { enqueueSnackbar } = useSnackbar();
  const [images, dispatch] = React.useReducer(imageUploadReducer, []);

  const unMountRef = React.useRef(false);

  const {
    handleSubmit,
    handleChange,
    handleBlur,
    setFieldValue,
    setFieldError,
    values,
    touched,
    errors,
  } = useFormik({
    initialValues: {
      selectedImages: [],
      title: "",
      price: "",
      category: "",
      condition: "",
      description: "",
    },
    validationSchema: validationSchema,
    onSubmit: (data) => {
      const imageIds = data.selectedImages.map((image) => image.id);
      const { title, price, category, condition, description } = data;
      const payload = {
        title,
        price,
        category,
        condition,
        description,
        images: imageIds,
      };
      mutate(payload, {
        onSuccess: handleSuccess,
      });
    },
  });

  const handleSuccess = (data) => {
    enqueueSnackbar("Your item has been listed successfully", {
      variant: "success",
    });
    history.replace(`/listings/${data.id}`);
  };

  React.useEffect(() => {
    return () => {
      unMountRef.current = true;
    };
  }, []);

  React.useEffect(() => {
    setFieldValue("selectedImages", images);
  }, [images, setFieldValue]);

  const validateImages = (files) => {
    const totalCount = values.selectedImages.length + files.length;

    if (totalCount > MAX_IMAGE_COUNT) {
      const msg = `You cannot upload more than ${MAX_IMAGE_COUNT} images`;
      setFieldError("selectedImages", msg);
      return false;
    }

    for (const file of files) {
      if (file.size > MAX_IMAGE_SIZE) {
        const msg =
          `The size of each image cannot be greater` +
          `than ${MAX_IMAGE_SIZE / MAX_IMAGE_SIZE_UNIT}MB`;
        setFieldError("selectedImages", msg);
        return false;
      }
    }
    return true;
  };

  const handleImageChooserChange = (event) => {
    const files = Array.from(event.target.files);
    event.target.value = "";

    if (!validateImages(files)) {
      return;
    }

    const newImages = files.map((file) => ({
      key: uuidv4(),
      id: null,
      file: file,
      status: UploadStatus.IDLE,
      src: URL.createObjectURL(file),
      loaded: false,
      abortController: new AbortController(),
    }));

    dispatch({ type: "IMAGES_ADDED", payload: newImages });
  };

  const handleImageUpload = async (img) => {
    const data = await uploadListingImage(img);
    dispatch({
      type: "IMAGE_UPLOADED",
      payload: { key: img.key, id: data.id },
    });
  };

  const handleImageLoad = (e, imageKey) => {
    URL.revokeObjectURL(e.target.src);
    const imageToUpload = images.find((img) => img.key === imageKey);
    dispatch({ type: "IMAGE_LOADED", payload: imageToUpload });
    handleImageUpload(imageToUpload);
  };

  const handleImageRemove = (imgToRemove) => {
    if (imgToRemove.status === UploadStatus.PENDING) {
      imgToRemove.abortController.abort();
    }
    dispatch({ type: "IMAGE_REMOVED", payload: imgToRemove.key });
  };

  const isUploadingImages = () => {
    return images.some((image) => image.status === UploadStatus.PENDING);
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 3, px: 5 }}>
      <Grid container spacing={0}>
        <Typography component="h2" variant="h5" mb={2}>
          New Listing
        </Typography>
        <form onSubmit={handleSubmit}>
          <Grid item sx={{ mb: 8 }}>
            <label htmlFor="contained-button-file">
              <Input
                id="contained-button-file"
                accept="image/*"
                type="file"
                onChange={handleImageChooserChange}
                multiple
              />
              <Box
                display="flex"
                flexDirection="column"
                alignItems="center"
                justifyContent="center"
                borderRadius="4px"
                height={100}
                border={`1px dotted ${grey[400]}`}
                color={grey[600]}
                sx={{ cursor: "pointer" }}
                mb={1}
                role="button"
              >
                <Image />
                <Typography variant="subtitle2" mt={1}>
                  Select click to browse
                </Typography>
              </Box>
              {Boolean(errors.selectedImages) && (
                <FormHelperText error={true}>
                  {errors.selectedImages}
                </FormHelperText>
              )}
            </label>
            <Box
              display="grid"
              gridTemplateColumns="repeat(auto-fill, minmax(90px, 1fr))"
              gap={1}
              mb={1}
              mt={2}
              width="100%"
            >
              {images.map((image) => (
                <Box key={image.key} m={0}>
                  <Box position="relative">
                    {image.loaded && (
                      <Box
                        position="absolute"
                        right={-15}
                        top={-15}
                        color={(theme) => theme.palette.grey[500]}
                        onClick={() => handleImageRemove(image)}
                      >
                        <IconButton aria-label="close">
                          <IconX size={15} />
                        </IconButton>
                      </Box>
                    )}
                    {image.loaded && image.status === UploadStatus.PENDING ? (
                      <Box
                        sx={{
                          position: "absolute",
                          left: "50%",
                          top: "50%",
                          transform: "translate(-50%, -50%)",
                        }}
                      >
                        <CircularProgress size={30} />
                      </Box>
                    ) : null}

                    <img
                      src={image.src}
                      alt="listing"
                      width="100%"
                      height="90"
                      style={{
                        objectFit: "cover",
                        opacity:
                          image.status === UploadStatus.PENDING ? 0.7 : 1,
                        border: `1px solid ${grey[200]}`,
                        borderRadius: "4px",
                        display: "block",
                      }}
                      onLoad={(e) => handleImageLoad(e, image.key)}
                    />
                  </Box>
                </Box>
              ))}
            </Box>
            <TextField
              label="Title"
              name="title"
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.title}
              error={touched.title && Boolean(errors.title)}
              helperText={touched.title && errors.title}
              margin="dense"
              fullWidth
            />
            <TextField
              label="Price"
              name="price"
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.price}
              error={touched.price && Boolean(errors.price)}
              helperText={touched.price && errors.price}
              margin="dense"
              inputProps={{ inputMode: "numeric", pattern: "[0-9]*" }}
              fullWidth
            />
            <TextField
              label="Category"
              name="category"
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.category}
              error={touched.category && Boolean(errors.category)}
              helperText={touched.category && errors.category}
              margin="dense"
              select
              fullWidth
            >
              {categories.map((category) => (
                <MenuItem value={category.id} key={category.id}>
                  {category.name}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              label="Condition"
              name="condition"
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.condition}
              error={touched.condition && Boolean(errors.condition)}
              helperText={touched.condition && errors.condition}
              margin="dense"
              fullWidth
              select
            >
              <MenuItem value="US">Used</MenuItem>
              <MenuItem value="NE">New</MenuItem>
            </TextField>
            <TextField
              label="Description"
              name="description"
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.description}
              error={touched.description && Boolean(errors.description)}
              helperText={touched.description && errors.description}
              margin="dense"
              multiline
              fullWidth
            />
            <Button
              variant="contained"
              size="large"
              type="submit"
              disabled={isUploadingImages() || isLoading}
              disableElevation
              fullWidth
              sx={{ mt: 2, fontWeight: 600 }}
            >
              Add listing
            </Button>
          </Grid>
        </form>
      </Grid>
    </Container>
  );
}

export default AddListing;
