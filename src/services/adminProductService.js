import Product from "../models/Product.js";
import ProductVariant from "../models/ProductVariant.js";
import ApiError from "../utils/ApiError.js";


// Admin lấy tất cả sản phẩm
export const getAdminProductsService = async () => {

  const products = await Product.find()
    .populate("brand","name logo")
    .populate("category","name")
    .sort({
      createdAt:-1,
    });


  return products;

};



// Admin lấy chi tiết
export const getAdminProductByIdService = async(id)=>{

  const product = await Product.findById(id)
    .populate("brand","name logo")
    .populate("category","name");


  if(!product){
    throw new ApiError(
      404,
      "Không tìm thấy sản phẩm"
    );
  }


  return product;

};




// Admin thêm sản phẩm
export const createAdminProductService = async(body)=>{

  const product = await Product.create(body);

  return product;

};




// Admin cập nhật sản phẩm
export const updateAdminProductService = async(
  id,
  body
)=>{


  const product = await Product.findById(id);


  if(!product){
    throw new ApiError(
      404,
      "Không tìm thấy sản phẩm"
    );
  }



  Object.keys(body).forEach((key)=>{

    product[key] = body[key];

  });



  await product.save();


  return product;

};




// Admin ẩn sản phẩm
export const hideProductService = async(id)=>{


  const product = await Product.findById(id);


  if(!product){
    throw new ApiError(
      404,
      "Không tìm thấy sản phẩm"
    );
  }



  product.status = "inactive";


  await product.save();


  return product;

};




// Admin mở lại sản phẩm
export const activeProductService = async(id)=>{


  const product = await Product.findById(id);


  if(!product){
    throw new ApiError(
      404,
      "Không tìm thấy sản phẩm"
    );
  }


  product.status="active";


  await product.save();


  return product;

};




// Xóa thật sản phẩm
export const deleteAdminProductService = async(id)=>{


  const product = await Product.findById(id);


  if(!product){
    throw new ApiError(
      404,
      "Không tìm thấy sản phẩm"
    );
  }



  // xóa biến thể trước
  await ProductVariant.deleteMany({
    product:id,
  });



  await Product.findByIdAndDelete(id);



  return {
    message:"Xóa sản phẩm thành công"
  };

};