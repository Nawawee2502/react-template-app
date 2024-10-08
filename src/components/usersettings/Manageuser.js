import { Box, Button, InputAdornment, TextField, Typography, Drawer, IconButton } from '@mui/material';
import React, { useState, useEffect } from 'react';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import SearchIcon from '@mui/icons-material/Search';
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Checkbox from '@mui/material/Checkbox';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
// import { addBranch, deleteBranch, updateBranch, productAll, countBranch } from '../api/branchApi';
import { addProduct, deleteProduct, updateProduct, productAll, countProduct, searchProduct, lastProductCode } from '../../api/productrecordApi';
import { useFormik } from "formik";
import { useDispatch, useSelector } from "react-redux";
import { errorHelper } from "../handle-input-error";
import { Alert, AlertTitle } from '@mui/material';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
        backgroundColor: '#754C27',
        color: theme.palette.common.white,
    },
    [`&.${tableCellClasses.body}`]: {
        fontSize: '16px',
    },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
    '&:nth-of-type(odd)': {
        backgroundColor: theme.palette.action.hover,
    },
    '&:last-child td, &:last-child th': {
        border: 0,
    },
}));


export default function ManageUser() {
    const [selected, setSelected] = useState([]);
    const dispatch = useDispatch();
    const [alert, setAlert] = useState({ open: false, message: '', severity: 'success' });
    const [product, setProduct] = useState([]);
    const [page, setPage] = useState(0);
    const [count, setCount] = useState();
    const [searchTerm, setSearchTerm] = useState("");
    const [getLastProductCode, setGetLastProductCode] = useState([]);

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    useEffect(() => {
        if (searchTerm) {
            dispatch(searchProduct({ product_name: searchTerm }))
                .unwrap()
                .then((res) => {
                    setProduct(res.data);
                })
                .catch((err) => console.log(err.message));
        } else {
            refetchData();
        }
    }, [searchTerm, dispatch]);

    const handleChange = (event, value) => {
        setPage(value);
        console.log(value);
        let page = value - 1;
        let offset = page * 5;
        let limit = value * 5;
        console.log(limit, offset);
        dispatch(productAll({ offset, limit }))
            .unwrap()
            .then((res) => {
                console.log(res.data);
                let resultData = res.data;
                for (let indexArray = 0; indexArray < resultData.length; indexArray++) {
                    resultData[indexArray].id = offset + indexArray + 1;
                }
                setProduct(resultData);
            })
            .catch((err) => err.message);
    };

    const refetchData = () => {
        let offset = 0;
        let limit = 5;
        dispatch(productAll({ offset, limit }))
            .unwrap()
            .then((res) => {
                setProduct(res.data);
            })
            .catch((err) => console.log(err.message));
    };

    useEffect(() => {
        refetchData();
        let offset = 0;
        let limit = 5;
        let test = 10;
        dispatch(productAll({ offset, limit }))
            .unwrap()
            .then((res) => {
                console.log(res.data);
                let resultData = res.data;
                for (let indexArray = 0; indexArray < resultData.length; indexArray++) {
                    resultData[indexArray].id = indexArray + 1;
                }
                setProduct(resultData);
                console.log(resultData);

            })
            .catch((err) => err.message);

        dispatch(lastProductCode({ test }))
            .unwrap()
            .then((res) => {
                setGetLastProductCode(res.data);
                console.log(res.data)
            })
            .catch((err) => err.message);

        dispatch(countProduct({ test }))
            .unwrap()
            .then((res) => {
                console.log(res.data);
                let resData = res.data;
                let countPaging = Math.floor(resData / 5);
                let modPaging = resData % 5;
                if (modPaging > 0) {
                    countPaging++
                }
                console.log(countPaging, modPaging);
                setCount(countPaging);
            })
            .catch((err) => err.message);
    }, [dispatch]);

    const handleCheckboxChange = (event, product_code) => {
        if (event.target.checked) {
            setSelected([...selected, product_code]);
        } else {
            setSelected(selected.filter((item) => item !== product_code));
        }
    };

    const handleSelectAllClick = (event) => {
        if (event.target.checked) {
            const newSelected = product.map((row) => row.product_code);
            setSelected(newSelected);
        } else {
            setSelected([]);
        }
    };

    const handleDelete = (product_code) => {
        dispatch(deleteProduct({ product_code }))
            .unwrap()
            .then((res) => {
                setAlert({ open: true, message: 'Deleted successfully', severity: 'success' });
                setTimeout(() => {
                    setAlert((prev) => ({ ...prev, open: false }));
                }, 3000);
                refetchData();
                let offset = 0;
                let limit = 5;
                dispatch(productAll({ offset, limit }))
                    .unwrap()
                    .then((res) => setProduct(res.data));
            })
            .catch((err) => {
                setAlert({ open: true, message: 'Error deleting Branch', severity: 'error' });
                setTimeout(() => {
                    setAlert((prev) => ({ ...prev, open: false }));
                }, 3000);
            });
    };

    const handleDeleteSelected = () => {
        Promise.all(selected.map(product_code =>
            dispatch(deleteProduct({ product_code })).unwrap()
        ))
            .then(() => {
                setAlert({ open: true, message: 'Deleted successfully', severity: 'success' });
                setTimeout(() => {
                    setAlert((prev) => ({ ...prev, open: false }));
                }, 3000);
                setSelected([]);
                refetchData();
                let offset = 0;
                let limit = 5;
                dispatch(productAll({ offset, limit }))
                    .unwrap()
                    .then((res) => setProduct(res.data));
            })
            .catch((err) => {
                setAlert({ open: true, message: 'Error deleting branch', severity: 'error' });
                setTimeout(() => {
                    setAlert((prev) => ({ ...prev, open: false }));
                }, 3000);
            });
    };

    const [openDrawer, setOpenDrawer] = useState(false);
    const [openEditDrawer, setOpenEditDrawer] = useState(false);

    const toggleDrawer = (openDrawer) => () => {
        setOpenDrawer(openDrawer);
        handleGetLastCode();
    };

    const handleGetLastCode = () => {
        let test = "";
        dispatch(lastProductCode({ test }))
            .unwrap()
            .then((res) => {

                console.log(res.data)
                let lastProductCode = "" + (Number(res.data.product_code) + 1)
                if (lastProductCode.length === 1) {
                    lastProductCode = "00" + lastProductCode
                }
                if (lastProductCode.length === 2) {
                    lastProductCode = "0" + lastProductCode
                }
                setGetLastProductCode(lastProductCode);
                formik.setValues({
                    product_code: lastProductCode,
                });
            })
            .catch((err) => err.message);
    };

    const toggleEditDrawer = (openEditDrawer) => () => {
        setOpenEditDrawer(openEditDrawer);
    };

    const [editProduct, setEditProduct] = useState(null);

    const handleEdit = (row) => {
        setEditProduct(row);
        formik.setValues({
            product_code: row.product_code,
            product_name: row.product_name,
            addr1: row.addr1,
            addr2: row.addr2,
            tel1: row.tel1,
        });
        toggleEditDrawer(true)();
    };

    const handleSave = () => {
        dispatch(updateProduct(formik.values))
            .unwrap()
            .then((res) => {
                setAlert({ open: true, message: 'Updated success', severity: 'success' });
                refetchData();
                toggleEditDrawer(false)();
                setTimeout(() => {
                    setAlert((prev) => ({ ...prev, open: false }));
                }, 3000);
            })
            .catch((err) => {
                setAlert({ open: true, message: 'Updated Error', severity: 'error' });
                setTimeout(() => {
                    setAlert((prev) => ({ ...prev, open: false }));
                }, 3000);
            });
    };

    const formik = useFormik({
        initialValues: {
            product_code: "",
            product_name: "",
            addr1: "",
            addr2: "",
            tel1: "",
        },
        onSubmit: (values) => {
            dispatch(addProduct(values))
                .unwrap()
                .then((res) => {
                    setAlert({ open: true, message: 'เพิ่มข้อมูลสำเร็จ', severity: 'success' });
                    formik.resetForm();
                    refetchData();
                    handleGetLastCode();

                    setTimeout(() => {
                        setAlert((prev) => ({ ...prev, open: false }));
                    }, 3000);

                })
                .catch((err) => {
                    setAlert({ open: true, message: 'เกิดข้อผิดพลาดในการเพิ่มข้อมูล', severity: 'error' });
                    setTimeout(() => {
                        setAlert((prev) => ({ ...prev, open: false }));
                    }, 3000);
                });
        },
    });

    return (
        <>
            <Box
                sx={{
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                <Button
                    onClick={toggleDrawer(true)}
                    sx={{
                        width: '209px',
                        height: '70px',
                        background: 'linear-gradient(180deg, #AD7A2C 0%, #754C27 100%)',
                        borderRadius: '15px',
                        boxShadow: '0px 4px 4px 0px #00000040',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        '&:hover': {
                            background: 'linear-gradient(180deg, #8C5D1E 0%, #5D3A1F 100%)',
                        }
                    }}
                >
                    <AddCircleIcon sx={{ fontSize: '42px', color: '#FFFFFF', mr: '12px' }} />
                    <Typography sx={{ fontSize: '24px', fontWeight: '600', color: '#FFFFFF' }}>
                        Create
                    </Typography>
                </Button>
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        mt: '48px',
                        width: '60%'
                    }}
                >
                    <Typography sx={{ fontSize: '16px', fontWeight: '600', mr: '24px' }}>
                        User Search
                    </Typography>
                    <TextField
                        value={searchTerm}
                        onChange={handleSearchChange}
                        placeholder="Search"
                        sx={{
                            '& .MuiInputBase-root': {
                                height: '38px',
                                width: '100%'
                            },
                            '& .MuiOutlinedInput-input': {
                                padding: '8.5px 14px',
                            },
                            width: '40%'
                        }}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchIcon sx={{ color: '#5A607F' }} />
                                </InputAdornment>
                            ),
                        }}
                    />
                </Box>
                <Box sx={{ width: '90%', mt: '24px' }}>
                    <Button
                        variant="contained"
                        color="error"
                        onClick={handleDeleteSelected}
                        sx={{ mt: 2 }}
                        disabled={selected.length === 0}
                    >
                        Delete Selected ({selected.length})
                    </Button>
                </Box>
                <TableContainer component={Paper} sx={{ width: '90%', mt: '24px' }}>
                    <Table sx={{}} aria-label="customized table">
                        <TableHead>
                            <TableRow>
                                <StyledTableCell sx={{ width: '1%', textAlign: 'center' }}>
                                    <Checkbox
                                        sx={{ color: '#FFF' }}
                                        indeterminate={selected.length > 0 && selected.length < product.length}
                                        checked={product.length > 0 && selected.length === product.length}
                                        onChange={handleSelectAllClick}
                                    />
                                </StyledTableCell>
                                <StyledTableCell width='1%' >No.</StyledTableCell>
                                <StyledTableCell width='1%' >User ID</StyledTableCell>
                                <StyledTableCell align="center">User Name</StyledTableCell>
                                <StyledTableCell align="center">User Type</StyledTableCell>
                                <StyledTableCell align="center">User</StyledTableCell>
                                <StyledTableCell align="center">Email</StyledTableCell>
                                <StyledTableCell align="center">Line ID</StyledTableCell>
                                <StyledTableCell width='1%' align="center"></StyledTableCell>
                                <StyledTableCell width='1%' align="center"></StyledTableCell>

                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {product.map((row) => (
                                <StyledTableRow key={row.product_code}>
                                    <StyledTableCell padding="checkbox" align="center">
                                        <Checkbox
                                            checked={selected.includes(row.product_code)}
                                            onChange={(event) => handleCheckboxChange(event, row.product_code)}
                                        />
                                    </StyledTableCell>
                                    <StyledTableCell component="th" scope="row" >
                                        {row.id}
                                    </StyledTableCell>
                                    <StyledTableCell align="center">{row.typeproduct_code}</StyledTableCell>
                                    <StyledTableCell align="center">{row.product_code}</StyledTableCell>
                                    <StyledTableCell align="center">{row.product_name}</StyledTableCell>
                                    <StyledTableCell align="center">{row.bulk_unit_code}</StyledTableCell>
                                    <StyledTableCell align="center">{row.bulk_unit_price}</StyledTableCell>
                                    <StyledTableCell align="center">{row.retail_unit_code}</StyledTableCell>
                                    <StyledTableCell align="center">
                                        <IconButton
                                            color="primary"
                                            size="md"
                                            onClick={() => handleEdit(row)} // เรียกใช้ฟังก์ชัน handleEdit
                                            sx={{ border: '1px solid #AD7A2C', borderRadius: '7px' }}
                                        >
                                            <EditIcon sx={{ color: '#AD7A2C' }} />
                                        </IconButton>
                                    </StyledTableCell>
                                    <StyledTableCell align="center">
                                        <IconButton
                                            color="danger"
                                            size="md"
                                            onClick={() => handleDelete(row.product_code)} // Use a function to handle delete
                                            sx={{ border: '1px solid #F62626', borderRadius: '7px' }}
                                        >
                                            <DeleteIcon sx={{ color: '#F62626' }} />
                                        </IconButton>

                                    </StyledTableCell>
                                </StyledTableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Box>
            <Drawer
                anchor="right"
                open={openDrawer}
                onClose={toggleDrawer(false)}
                ModalProps={{
                    BackdropProps: {
                        style: {
                            backgroundColor: 'transparent',
                        },
                    },
                }}
                PaperProps={{
                    sx: {
                        boxShadow: 'none',
                        width: '25%',
                        borderRadius: '20px',
                        border: '1px solid #E4E4E4',
                        bgcolor: '#FAFAFA'
                    },
                }}
            >
                <Box
                    sx={{
                        width: '100%',
                        mt: '80px',
                        flexDirection: 'column'
                    }}
                >
                    <Box
                        sx={{
                            position: 'absolute',
                            top: '48px',
                            left: '0',
                            width: '129px',
                            bgcolor: '#AD7A2C',
                            color: '#FFFFFF',
                            px: '8px',
                            py: '4px',
                            borderRadius: '5px',
                            fontWeight: 'bold',
                            zIndex: 1,
                            borderRadius: '20px',
                            height: '89px',
                            display: 'flex',
                            justifyContent: 'center',
                        }}
                    >
                        <Typography sx={{ fontWeight: '600', fontSize: '14px' }} >
                            Product
                        </Typography>
                    </Box>
                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            flexDirection: 'column',
                            border: '1px solid #E4E4E4',
                            borderRadius: '10px',
                            bgcolor: '#FFFFFF',
                            height: '100%',
                            p: '16px',
                            position: 'relative',
                            zIndex: 2,
                        }}>

                        <Typography sx={{ display: 'flex', flexDirection: 'row' }}>
                            Product ID :
                            <Typography sx={{ color: '#754C27', ml: '12px' }}>
                                #011
                            </Typography>
                        </Typography>
                        <Box sx={{ width: '80%', mt: '24px' }}>
                            <Typography sx={{ fontSize: '16px', fontWeight: '600', color: '#754C27' }}>
                                User Id
                            </Typography>
                            <TextField
                                size="small"
                                // placeholder={getLastTypeproductCode}
                                disabled

                                sx={{
                                    mt: '8px',
                                    width: '100%',
                                    '& .MuiOutlinedInput-root': {
                                        borderRadius: '10px',
                                    },
                                }}
                                {...formik.getFieldProps("")}
                                {...errorHelper(formik, "")}
                                value={getLastProductCode}
                            />
                            <Typography sx={{ fontSize: '16px', fontWeight: '600', color: '#754C27', mt: '18px' }}>
                                User Name
                            </Typography>
                            <TextField
                                size="small"
                                placeholder="Name"
                                sx={{
                                    mt: '8px',
                                    width: '100%',
                                    '& .MuiOutlinedInput-root': {
                                        borderRadius: '10px',
                                    },
                                }}
                                {...formik.getFieldProps("")}
                                {...errorHelper(formik, "")}
                            />
                            <Typography sx={{ fontSize: '16px', fontWeight: '600', color: '#754C27', mt: '18px' }}>
                                User Type Name
                            </Typography>
                            <TextField
                                size="small"
                                placeholder="User Type Name"
                                sx={{
                                    mt: '8px',
                                    width: '100%',
                                    '& .MuiOutlinedInput-root': {
                                        borderRadius: '10px',
                                    },
                                }}
                                {...formik.getFieldProps("")}
                                {...errorHelper(formik, "")}
                            />
                            <Typography sx={{ fontSize: '16px', fontWeight: '600', color: '#754C27', mt: '18px' }}>
                                User
                            </Typography>
                            <TextField
                                size="small"
                                placeholder="User"
                                sx={{
                                    mt: '8px',
                                    width: '100%',
                                    '& .MuiOutlinedInput-root': {
                                        borderRadius: '10px',
                                    },
                                }}
                                {...formik.getFieldProps("")}
                                {...errorHelper(formik, "")}
                            />
                            <Typography sx={{ fontSize: '16px', fontWeight: '600', color: '#754C27', mt: '18px' }}>
                                Password
                            </Typography>
                            <TextField
                                size="small"
                                placeholder="Password"
                                sx={{
                                    mt: '8px',
                                    width: '100%',
                                    '& .MuiOutlinedInput-root': {
                                        borderRadius: '10px',
                                    },
                                }}
                                {...formik.getFieldProps("")}
                                {...errorHelper(formik, "")}
                            />
                            <Typography sx={{ fontSize: '16px', fontWeight: '600', color: '#754C27', mt: '18px' }}>
                                Email
                            </Typography>
                            <TextField
                                size="small"
                                placeholder="Email"
                                sx={{
                                    mt: '8px',
                                    width: '100%',
                                    '& .MuiOutlinedInput-root': {
                                        borderRadius: '10px',
                                    },
                                }}
                                {...formik.getFieldProps("")}
                                {...errorHelper(formik, "")}
                            />
                            <Typography sx={{ fontSize: '16px', fontWeight: '600', color: '#754C27', mt: '18px' }}>
                                Line ID
                            </Typography>
                            <TextField
                                size="small"
                                placeholder="Line ID"
                                sx={{
                                    mt: '8px',
                                    width: '100%',
                                    '& .MuiOutlinedInput-root': {
                                        borderRadius: '10px',
                                    },
                                }}
                                {...formik.getFieldProps("")}
                                {...errorHelper(formik, "")}
                            />
                        </Box>
                        <Box sx={{ mt: '24px' }} >
                            <Button variant='contained'
                                sx={{
                                    width: '100px',
                                    bgcolor: '#F62626',
                                    '&:hover': {
                                        bgcolor: '#D32F2F',
                                    },
                                }}
                            >
                                Cancel
                            </Button>
                            <Button variant='contained'
                                onClick={formik.handleSubmit}
                                sx={{
                                    width: '100px',
                                    bgcolor: '#754C27',
                                    '&:hover': {
                                        bgcolor: '#5A3D1E',
                                    },
                                    ml: '24px'
                                }}
                            >
                                Save
                            </Button>
                        </Box>
                    </Box>
                </Box>
            </Drawer>
            <Drawer
                anchor="right"
                open={openEditDrawer}
                onClose={toggleEditDrawer(false)}
                ModalProps={{
                    BackdropProps: {
                        style: {
                            backgroundColor: 'transparent',
                        },
                    },
                }}
                PaperProps={{
                    sx: {
                        boxShadow: 'none',
                        width: '25%',
                        borderRadius: '20px',
                        border: '1px solid #E4E4E4',
                        bgcolor: '#FAFAFA'
                    },
                }}
            >
                <Box
                    sx={{
                        width: '100%',
                        mt: '80px',
                        flexDirection: 'column'
                    }}
                >
                    <Box
                        sx={{
                            position: 'absolute',
                            top: '48px',
                            left: '0',
                            width: '129px',
                            bgcolor: '#AD7A2C',
                            color: '#FFFFFF',
                            px: '8px',
                            py: '4px',
                            borderRadius: '20px',
                            fontWeight: 'bold',
                            zIndex: 1,
                            height: '89px',
                            display: 'flex',
                            justifyContent: 'center',
                        }}
                    >
                        <Typography sx={{ fontWeight: '600', fontSize: '14px' }} >
                            Branch
                        </Typography>
                    </Box>
                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            flexDirection: 'column',
                            border: '1px solid #E4E4E4',
                            borderRadius: '10px',
                            bgcolor: '#FFFFFF',
                            height: '100%',
                            p: '16px',
                            position: 'relative',
                            zIndex: 2,
                        }}>

                        <Typography sx={{ display: 'flex', flexDirection: 'row' }}>
                            User ID :
                            <Typography sx={{ color: '#754C27', ml: '12px' }}>
                                #011
                            </Typography>
                        </Typography>
                        <Box sx={{ width: '80%', mt: '24px' }}>
                            <Typography sx={{ fontSize: '16px', fontWeight: '600', color: '#754C27' }}>
                                User Id
                            </Typography>
                            <TextField
                                size="small"
                                // placeholder={getLastTypeproductCode}
                                disabled

                                sx={{
                                    mt: '8px',
                                    width: '100%',
                                    '& .MuiOutlinedInput-root': {
                                        borderRadius: '10px',
                                    },
                                }}
                                {...formik.getFieldProps("")}
                                {...errorHelper(formik, "")}
                                value={getLastProductCode}
                            />
                            <Typography sx={{ fontSize: '16px', fontWeight: '600', color: '#754C27', mt: '18px' }}>
                                User Name
                            </Typography>
                            <TextField
                                size="small"
                                placeholder="Name"
                                sx={{
                                    mt: '8px',
                                    width: '100%',
                                    '& .MuiOutlinedInput-root': {
                                        borderRadius: '10px',
                                    },
                                }}
                                {...formik.getFieldProps("")}
                                {...errorHelper(formik, "")}
                            />
                            <Typography sx={{ fontSize: '16px', fontWeight: '600', color: '#754C27', mt: '18px' }}>
                                User Type Name
                            </Typography>
                            <TextField
                                size="small"
                                placeholder="User Type Name"
                                sx={{
                                    mt: '8px',
                                    width: '100%',
                                    '& .MuiOutlinedInput-root': {
                                        borderRadius: '10px',
                                    },
                                }}
                                {...formik.getFieldProps("")}
                                {...errorHelper(formik, "")}
                            />
                            <Typography sx={{ fontSize: '16px', fontWeight: '600', color: '#754C27', mt: '18px' }}>
                                User
                            </Typography>
                            <TextField
                                size="small"
                                placeholder="User"
                                sx={{
                                    mt: '8px',
                                    width: '100%',
                                    '& .MuiOutlinedInput-root': {
                                        borderRadius: '10px',
                                    },
                                }}
                                {...formik.getFieldProps("")}
                                {...errorHelper(formik, "")}
                            />
                            <Typography sx={{ fontSize: '16px', fontWeight: '600', color: '#754C27', mt: '18px' }}>
                                Password
                            </Typography>
                            <TextField
                                size="small"
                                placeholder="Password"
                                sx={{
                                    mt: '8px',
                                    width: '100%',
                                    '& .MuiOutlinedInput-root': {
                                        borderRadius: '10px',
                                    },
                                }}
                                {...formik.getFieldProps("")}
                                {...errorHelper(formik, "")}
                            />
                            <Typography sx={{ fontSize: '16px', fontWeight: '600', color: '#754C27', mt: '18px' }}>
                                Email
                            </Typography>
                            <TextField
                                size="small"
                                placeholder="Email"
                                sx={{
                                    mt: '8px',
                                    width: '100%',
                                    '& .MuiOutlinedInput-root': {
                                        borderRadius: '10px',
                                    },
                                }}
                                {...formik.getFieldProps("")}
                                {...errorHelper(formik, "")}
                            />
                            <Typography sx={{ fontSize: '16px', fontWeight: '600', color: '#754C27', mt: '18px' }}>
                                Line ID
                            </Typography>
                            <TextField
                                size="small"
                                placeholder="Line ID"
                                sx={{
                                    mt: '8px',
                                    width: '100%',
                                    '& .MuiOutlinedInput-root': {
                                        borderRadius: '10px',
                                    },
                                }}
                                {...formik.getFieldProps("")}
                                {...errorHelper(formik, "")}
                            />
                        </Box>
                        <Box sx={{ mt: '24px' }} >
                            <Button variant='contained'
                                sx={{
                                    width: '100px',
                                    bgcolor: '#F62626',
                                    '&:hover': {
                                        bgcolor: '#D32F2F',
                                    },
                                }}
                            >
                                Cancel
                            </Button>
                            <Button
                                onClick={handleSave}
                                sx={{
                                    width: '100px',
                                    backgroundColor: '#AD7A2C',
                                    color: '#FFFFFF',
                                    '&:hover': {
                                        backgroundColor: '#8C5D1E',
                                    },
                                    ml: '24px'
                                }}
                            >
                                Save
                            </Button>

                        </Box>
                    </Box>
                </Box>
            </Drawer>
            {alert.open && (
                <Alert severity={alert.severity} onClose={() => setAlert({ ...alert, open: false })}>
                    <AlertTitle>{alert.severity === 'success' ? 'Success' : 'Error'}</AlertTitle>
                    {alert.message}
                </Alert>
            )}
        </>
    );
}

