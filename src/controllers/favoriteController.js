import favoriteService from "../services/favoriteService.js";

class FavoriteController {
    async getFavorites(req, res) {
        try {
            const data = await favoriteService.getFavorites(req.user._id);

            return res.status(200).json({
                success: true,
                data,
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message,
            });
        }
    }

    async addFavorite(req, res) {
        try {
            const { productId } = req.params;

            const data = await favoriteService.addFavorite(
                req.user._id,
                productId
            );

            return res.status(200).json({
                success: true,
                message: "Đã thêm vào yêu thích",
                data,
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message,
            });
        }
    }

    async removeFavorite(req, res) {
        try {
            const { productId } = req.params;

            const data = await favoriteService.removeFavorite(
                req.user._id,
                productId
            );

            return res.status(200).json({
                success: true,
                message: "Đã xóa khỏi yêu thích",
                data,
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message,
            });
        }
    }

    async clearFavorite(req, res) {
        try {
            await favoriteService.clearFavorite(req.user._id);

            return res.status(200).json({
                success: true,
                message: "Đã xóa toàn bộ yêu thích",
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message,
            });
        }
    }
}

export default new FavoriteController();