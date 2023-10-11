import productsModel from '../schemas/products.schema.js'

class ProductsDAO {
    constructor() {
        console.log('Products DAO conected.')
    }

    
    async getAll() {
        try {
            const products = await productsModel.find().lean()
            return products
        } catch (error) {
            throw error;
        }

    }

    
    getProductById = async (pid) => {
        try {
            let foundProduct = await productsModel.findById(pid)
            if (!foundProduct) return null

            return foundProduct
        } catch (error) {
            throw error;
        }
    }

    
    createProduct = async (product) => {
        try {
            await productsModel.create(product)
            return ({ status: 200, message: `Product added.`, payload: product })
        } catch (error) {
            throw error;
        }
    }

    
    updateProduct = async (pid, updatedFields) => {
        try {
            let foundProduct = await productsModel.findById(pid)
            if (!foundProduct) return null
            const updatedProduct = await productsModel.findByIdAndUpdate(pid, updatedFields, { new: true });
            return updatedProduct;
        } catch (error) {
            throw error;
        }
    }

    
    deleteProduct = async (pid) => {
        try {
            const result = await productsModel.deleteOne({ _id: pid });
            if (result.deletedCount === 0) {
                return null
            }
            return { status: 'Success.', message: `Product ${pid} deleted.` };
        } catch (error) { return { status: 'Error', message: error.message } }
    };


    
    generateNewCode = async () => {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let randomCode = '';
        for (let i = 0; i < 7; i++) {
            const randomIndex = Math.floor(Math.random() * characters.length);
            randomCode += characters[randomIndex];
        }
        return randomCode
    }
}

export default new ProductsDAO()

