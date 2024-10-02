import axios from "axios";
import { createAsyncThunk } from "@reduxjs/toolkit";


const BASE_URL = `${process.env.REACT_APP_URL_API}`;

export const addProduct = createAsyncThunk(
    "product/add",
    async ({ product_img, product_code, product_name, typeproduct_code, bulk_unit_code, bulk_unit_price, retail_unit_code, retail_unit_price, unit_conversion_factor }, { dispatch }) => {
        try {
            const res = await axios.post(BASE_URL + "/api/addproduct", {
                product_img,
                product_code,
                product_name,
                typeproduct_code,
                bulk_unit_code,
                bulk_unit_price,
                retail_unit_code,
                retail_unit_price,
                unit_conversion_factor,
            });
            console.log(res.data);
            return res.data;
        } catch (error) {
            console.error(error.message);
            throw error;
        }
    }
);

export const updateProduct = createAsyncThunk(
    "product/update",
    async ({ product_img, product_code, product_name, typeproduct_code, bulk_unit_code, bulk_unit_price, retail_unit_code, retail_unit_price, unit_conversion_factor }, { dispatch }) => {
        try {
            const res = await axios.post(BASE_URL + "/api/updateproduct", {
                product_img,
                product_code,
                product_name,
                typeproduct_code,
                bulk_unit_code,
                bulk_unit_price,
                retail_unit_code,
                retail_unit_price,
                unit_conversion_factor,
            });
            console.log(res.data);
            return res.data;
        } catch (error) {
            console.error(error.message);
            throw error;
        }
    }
);


export const deleteProduct = createAsyncThunk(
    "product/delete",
    async ({ product_code }, { dispatch }) => {
        try {
            const res = await axios.post(BASE_URL + "/api/deleteproduct", {
                product_code,
            });
            console.log(res.data);
            return res.data;
        } catch (error) {
            console.error(error.message);
            throw error;
        }
    }
);


export const productAll = createAsyncThunk(
    "product/read",
    async ({ offset, limit }, { dispatch }) => {
        try {
            const res = await axios.post(BASE_URL + "/api/productall", { offset: offset, limit: limit });
            console.log(res.data);
            return res.data;
        } catch (error) {
            console.error(error.message);
            throw error;
        }
    }
);

export const countProduct = createAsyncThunk(
    "product/count",
    async ({ test }, { dispatch }) => {
        try {
            console.log("____TETS____");
            const res = await axios.post(BASE_URL + "/api/countproduct", { test: test });
            console.log(res.data);
            return res.data;
        } catch (error) {
            console.error(error.message);
            throw error;
        }
    }
);


