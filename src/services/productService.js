import axios from 'axios';
//import { getAuthSession } from "@/utils/auth";

const API_URL = 'http://localhost:8000';
//const API_URL = 'https://los-toneles.azurewebsites.net';

//*traer todos los productos
export const getAllProducts= async () => {
    try {
        //const session = await getAuthSession();
        const res = await axios.get(`${API_URL}/product`);
        return res.data;
    } catch (error) {
        
        throw new Error('Failed to fetch product');
    }
};

//*traer todos los productos featured
export const getAllFeaturedProducts= async () => {
    try {
        //const session = await getAuthSession();
        const res = await axios.get(`${API_URL}/product/featured`);
        return res.data;
    } catch (error) {
        
        throw new Error('Failed to fetch product');
    }
};

//*traer todos los productos visibles
export const getAllVisibleProducts= async () => {
    try {
        //const session = await getAuthSession();
        const res = await axios.get(`${API_URL}/product/visible`);
        return res.data;
    } catch (error) {
        
        throw new Error('Failed to fetch product');
    }
};

//*traer un producto
export const getOneProduct = async (id) => {
    try {
        const res = await axios.get(`${API_URL}/product/${id}`);
        return res.data;
    } catch (error) {
        
        throw new Error('Failed to fetch product');
    }
};

//*agregar producto
export const postProduct = async (productValue) => {
    console.log(productValue)
    try {
        const res = await axios.post(`${API_URL}/product`, productValue);
        return res;
    } catch (error) {
        throw new Error('Failed to post product');
    }
};

//*editar producto
export const editProduct = async (id, object) => {
    try {
        const res = await axios.put(`${API_URL}/product/${id}`, object);
        return res;
    } catch (error) {
        throw new Error('Fallo al editar product');
    }
};

//*editar producto Featured
export const editIsFeaturedProduct = async (id, object) => {
    try {
        const res = await axios.put(`${API_URL}/product/featured/${id}`, object);
        return res;
    } catch (error) {
        throw new Error('Fallo al editar product');
    }
};

//*editar producto
export const editIsVisibleProduct = async (id, object) => {
    try {
        const res = await axios.put(`${API_URL}/product/visible/${id}`, object);
        return res;
    } catch (error) {
        throw new Error('Fallo al editar product');
    }
};

//*eliminar producto
export const deleteProduct = async (id) => {
    try {
        const res = await axios.delete(`${API_URL}/product/${id}`);
        return res;
    } catch (error) {
        throw new Error('Failed to delete product');
    }
};
const Services = {
    getAllProducts,
    getAllFeaturedProducts,
    getAllVisibleProducts,
    getOneProduct,
    postProduct,
    editIsFeaturedProduct,
    editIsVisibleProduct,
    editProduct,
    deleteProduct,
};

export default Services;