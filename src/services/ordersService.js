import axios from 'axios';
//import { getAuthSession } from "@/utils/auth";

const API_URL = 'http://localhost:8000';
//const API_URL = 'https://los-toneles.azurewebsites.net';

//*traer todos los ordenes
// export const getAllProducts= async () => {
//     try {
//         //const session = await getAuthSession();
//         const res = await axios.get(`${API_URL}/orders`);
//         return res.data;
//     } catch (error) {
        
//         throw new Error('Failed to fetch orders');
//     }
// };

// //*traer una orden
// export const getOneProduct = async (id) => {
//     try {
//         const res = await axios.get(`${API_URL}/orders/${id}`);
//         return res.data;
//     } catch (error) {
        
//         throw new Error('Failed to fetch orders');
//     }
// };

//*traer ordenes de un usuario
export const getOneUsersOrders = async (userEmail) => {
    try {
        const res = await axios.get(`${API_URL}/orders/${userEmail}`);
        return res.data;
    } catch (error) {
        throw new Error('Failed to fetch orders');
    }
};

//*agregar orden
export const postProduct = async (ordersValue) => {
    try {
        const res = await axios.post(`${API_URL}/orders`, ordersValue);
        return res;
    } catch (error) {
        throw new Error('Failed to post orders');
    }
};

// //*editar orderso
// export const editIsVisibleProduct = async (id, object) => {
//     try {
//         const res = await axios.put(`${API_URL}/orders/visible/${id}`, object);
//         return res;
//     } catch (error) {
//         throw new Error('Fallo al editar orders');
//     }
// };

// //*eliminar orderso
// export const deleteProduct = async (id) => {
//     try {
//         const res = await axios.delete(`${API_URL}/orders/${id}`);
//         return res;
//     } catch (error) {
//         throw new Error('Failed to delete orders');
//     }
// };
const Services = {
    getOneUsersOrders,
    postProduct,
};

export default Services;