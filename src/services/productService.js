import Product from "../models/Product.js";
import ProductVariant from "../models/ProductVariant.js";
import ApiError from "../utils/ApiError.js";


// User lấy sản phẩm đang bán
export const getProductsService = async () => {
  const products = await Product.find({
    status: "active",
  })
    .populate("brand", "name logo")
    .populate("category", "name")
    .sort({
      createdAt: -1,
    });

  return products;
};


// User lấy chi tiết sản phẩm
export const getProductByIdService = async (id) => {
  const product = await Product.findOne({
    _id: id,
    status: "active",
  })
    .populate("brand", "name logo")
    .populate("category", "name");


  if (!product) {
    throw new ApiError(
      404,
      "Không tìm thấy sản phẩm"
    );
  }


  return product;
};


// Chi tiết sản phẩm + biến thể
export const getProductDetailService = async (id) => {

  const product = await Product.findOne({
    _id:id,
    status:"active"
  })
    .populate("brand", "name logo")
    .populate("category", "name");


  if (!product) {
    throw new ApiError(
      404,
      "Không tìm thấy sản phẩm"
    );
  }


  const variants = await ProductVariant.find({
    product:id,
  })
  .sort({
    color:1,
    size:1,
  });


  const groupedVariants = {};


  variants.forEach((variant)=>{

    if(!groupedVariants[variant.color]){
      groupedVariants[variant.color] = [];
    }


    groupedVariants[variant.color].push({

      _id:variant._id,
      size:variant.size,
      stock:variant.stock,
      image:variant.image,

    });

  });



  return {
    product,
    variants:groupedVariants,
  };

};



// Hàng mới về
export const getNewestProductsService = async () => {

  const products = await Product.find({
    status:"active",
  })
  .populate("brand","name logo")
  .populate("category","name")
  .sort({
    createdAt:-1,
  })
  .limit(10);


  return products;

};