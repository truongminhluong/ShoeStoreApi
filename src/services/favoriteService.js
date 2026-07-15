import Favorite from "../models/Favorite.js";

class FavoriteService {
    // Lấy danh sách yêu thích
    async getFavorites(userId) {
        return await Favorite.findOne({ user: userId }).populate({
            path: "products",
            populate: ["brand", "category"],
        });
    }

    // Thêm sản phẩm yêu thích
    async addFavorite(userId, productId) {
        let favorite = await Favorite.findOne({
            user: userId,
        });

        // Nếu user chưa có danh sách yêu thích
        if (!favorite) {
            favorite = await Favorite.create({
                user: userId,
                products: [],
            });
        }

        // Kiểm tra sản phẩm đã tồn tại chưa
        const exists = favorite.products.some(
            (item) => item.toString() === productId
        );

        if (!exists) {
            favorite.products.push(productId);
            await favorite.save();
        }

        return await favorite.populate({
            path: "products",
            populate: ["brand", "category"],
        });
    }

    // Xóa một sản phẩm
    async removeFavorite(userId, productId) {
        const favorite = await Favorite.findOne({
            user: userId,
        });

        if (!favorite) {
            return null;
        }

        favorite.products = favorite.products.filter(
            (item) => item.toString() !== productId
        );

        await favorite.save();

        return await favorite.populate("products");
    }

    // Xóa toàn bộ
    async clearFavorite(userId) {
        const favorite = await Favorite.findOne({
            user: userId,
        });

        if (!favorite) {
            return null;
        }

        favorite.products = [];

        await favorite.save();

        return favorite;
    }
}

export default new FavoriteService();