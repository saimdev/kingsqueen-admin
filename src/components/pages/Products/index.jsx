import { Card } from "@/components/ui"
import { useEffect, useState } from "react";
import { Button, Form, Modal, Input, Upload, Table, InputNumber, Checkbox, Popconfirm } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import ShortUniqueId from "short-unique-id";
import Column from "antd/es/table/Column";
import toast, { Toaster } from "react-hot-toast";


const uid = new ShortUniqueId({ length: 6 });

const Products = () => {
    const [isProductModalOpen, setIsProductModalOpen] = useState(false);
    const [form] = Form.useForm();
    const [catCheckedValues, setCatCheckedValues] = useState([]);

    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState('');
    const [previewTitle, setPreviewTitle] = useState('');
    const [fileList, setFileList] = useState([]);
    const [formErrors, setFormErrors] = useState({});
    const [editProduct, setEditProduct] = useState(null);
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [isTableLoading, setIsTableLoading] = useState(false);

    const [tableParams, setTableParams] = useState({
        pagination: {
            current: 1,
            total: 0,
            pageSize: 1,
        },
    });
    const [filters, setFilters] = useState(null);

    const getAllProducts = (filters = null) => {
        let filterUrlSuffix = '?';

        if (filters) {
            const { current, pageSize } = filters.pagination;
            const sort = filters.sort;
            let order = filters.order;
            const search = filters.search;

            if(order) order = order.replace('end', '');

            if (current) filterUrlSuffix += `page=${current}`;
            if (pageSize) filterUrlSuffix += `&limit=${pageSize}`;
            if (sort) filterUrlSuffix += `&sort=${sort}`;
            if (order) filterUrlSuffix += `&order=${order}`;
            if (search) filterUrlSuffix += `&search=${search}`;
        }

        setIsTableLoading(true);
        fetch(`${import.meta.env.VITE_API_BASE_URL}/admin/products${filterUrlSuffix}`)
            .then(response => response.json())
            .then(result => {
                console.log(result.data)
                setProducts(result.data);
                setTableParams(prev => {
                    return {
                        ...prev,
                        pagination: result.pagination
                    }
                })
                setIsTableLoading(false)
            })
    }

    const fetchCategories = async () => {
        try{
            const response = await fetch(import.meta.env.VITE_API_BASE_URL + '/admin/categories?limit=0');
            if (response.status == 200) {
                const result = await response.json();
                setCategories(result.data);
            }else{
                toast.error('Failed to fetch categories.');
            }
        }catch(err){
            toast.error('Failed to fetch categories.');
        }
    }

    useEffect(() => {
        getAllProducts();
        fetchCategories();
    }, [])

    useEffect(()=>{
        getAllProducts(filters);
    }, [filters])


    const colors = {
        id: 1,
        label: 'Color',
        name: 'color',
        values: [
            {
                label: 'Black',
                value: 'black'
            },
            {
                label: 'Green',
                value: 'green'
            },
            {
                label: 'Red',
                value: 'red'
            }
        ]
    }
    const sizes = {
        id: 2,
        label: 'Size',
        name: 'size',
        values: [
            {
                label: 'XS',
                value: 'xs'
            },
            {
                label: 'SM',
                value: 'sm'
            },
            {
                label: 'MD',
                value: 'md'
            },
            {
                label: 'LG',
                value: 'lg'
            },
            {
                label: 'XL',
                value: 'xl'
            },
            {
                label: 'XXL',
                value: 'xxl'
            },
            {
                label: 'XXXL',
                value: 'xxxl'
            }
        ]
    }

    const resetForm = () => {
        form.setFieldsValue({
            title: '',
            description: '',
            price: 0,
            discount_price: 0,
            stock: 0,
            colors: [],
            sizes: []
        });
    }

    const handleCatCheckbox = (event) => {
        const checkbox = event.target;
        if (checkbox.checked) {
            setCatCheckedValues(prev => {
                return [...prev, checkbox.data_value];
            });
        }
        else if (!checkbox.checked) {
            setCatCheckedValues(prev => {
                return prev.filter(item => item !== checkbox.data_value)
            });
        }
    }

    const RecursiveCategoryRender = ({ categories, ulKey = '', ulClass = "" }) => {
        return (
            <ul key={ulKey} className={`list-none ${ulClass}`}>
                {categories.length > 0 ? (
                    categories.map((cat, index) => {
                        const liKey = `${ulKey}_li_${index}`;
                        return (
                            <li key={liKey} className="relative my-1">
                                <label key={'label_' + liKey} className="flex items-center gap-2"><Checkbox key={uid.rnd()} onChange={handleCatCheckbox} checked={catCheckedValues.includes(cat.slug)} name="categories[]" data_value={cat.slug} /> {cat.name}</label>
                                {cat.children?.length > 0 ? (
                                    <RecursiveCategoryRender ulKey={liKey} categories={cat.children} ulClass="translate-x-4" />
                                ) : ''}
                            </li>
                        );
                    })
                ) : ''}
            </ul>
        );
    }


    /* Modal Methods */
    const showProductAddModal = () => {
        setIsProductModalOpen(true);
    };

    const handleModalCancel = () => {
        setFileList([]);
        setCatCheckedValues([]);
        setEditProduct(null);
        setIsProductModalOpen(false);
    };

    /* File Upload Methods */
    const getBase64 = (file) =>
        new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = (error) => reject(error);
        });


    const handleFileUploadCancel = () => setPreviewOpen(false);

    const handleFilePreview = async (file) => {
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj);
        }
        setPreviewImage(file.url || file.preview);
        setPreviewOpen(true);
        setPreviewTitle(file.name || file.url.substring(file.url.lastIndexOf('/') + 1));
    };

    const handleFileUploadChange = ({ fileList: newFileList }) => {
        console.log(newFileList)
        setFileList(newFileList);
    }

    const uploadButton = (
        <button
            style={{
                border: 0,
                background: 'none',
            }}
            type="button"
        >
            <PlusOutlined />
            <div
                style={{
                    marginTop: 8,
                }}
            >
                Upload
            </div>
        </button>
    );


    /* Form handle methods */
    const handleAddProductFormSubmit = async (data) => {
        const formData = new FormData();
        formData.append('title', data.title ?? '');
        formData.append('description', data.description ?? '');
        formData.append('price', data.price ?? 0);
        formData.append('discount_price', data.discount_price ?? 0);
        formData.append('stock', data.stock ?? 0);
        if (data.colors) data.colors.forEach(color => formData.append('colors', color))
        if (data.sizes) data.sizes.forEach(size => formData.append('sizes', size))
        formData.append('categories', JSON.stringify(catCheckedValues));

        fileList.forEach(file => {
            if (file.url) {
                const fileName = file.url.split('/').pop();
                formData.append('images', fileName);
            } else {
                formData.append('images', file.originFileObj)
            }
        })

        const method = editProduct ? 'PATCH' : 'POST';
        const urlSuffix = editProduct ? '/' + editProduct._id : '';

        const productToast = toast.loading('Product is saving...');
        const response = await fetch('http://localhost:5000/admin/products' + urlSuffix, {
            method: method,
            body: formData,
            credentials: 'include'
        });

        const result = await response.json();

        if (response.status == 400) {
            setFormErrors(result.data);
            return toast.error('Check input fields again.', { id: productToast });
        }

        toast.success('Product saved successfully.', {
            id: productToast
        })

        console.log(result)

        if (editProduct) {
            setEditProduct(result.data)
            return;
        }

        // Refill table data
        setProducts(prev => {
            return [...prev, result.data];
        })

        // Reset Form
        form.resetFields();
        setFileList([]);
        setCatCheckedValues([]);
        setEditProduct(null);

        // Reload table data
        getAllProducts();
    }

    useEffect(() => {
        if (editProduct) {
            // Set initial form values when editProduct changes
            form.setFieldsValue({
                title: editProduct.title,
                description: editProduct.description,
                price: editProduct.price,
                discount_price: editProduct.discount_price,
                stock: editProduct.stock,
                colors: editProduct.colors ?? [],
                sizes: editProduct.sizes ?? []
            });

            // Set the category checkboxes based on editProduct's categories
            setCatCheckedValues(editProduct.categories);

            // Set initial fileList for image upload
            const fileList = editProduct.images.map((image, index) => ({
                uid: index,
                name: `Image ${index + 1}`,
                status: 'done',
                url: `${import.meta.env.VITE_API_BASE_URL}/images/products/${image}`,
            }));
            setFileList(fileList);
        } else {
            resetForm();
        }

    }, [editProduct]);

    // Edit click handler
    const handleEditClick = (event) => {
        const id = event.currentTarget.dataset.id;

        fetch(`${import.meta.env.VITE_API_BASE_URL}/admin/products/${id}`)
            .then(response => response.json())
            .then(result => {
                setEditProduct(result.data);
                setIsProductModalOpen(true);
            })
    }

    // Delete click handler
    const handleDeleteClick = (id) => async()=> {
        toast.promise(
            fetch(`${import.meta.env.VITE_API_BASE_URL}/admin/products/${id}`, {
                method: 'DELETE',
                credentials: 'include'
            }),
            {
                loading: 'Deleting product...',
                success: (response) => {
                    if (response.status == 200) {
                        setProducts(prev => {
                            return prev.filter(product => product._id !== id);
                        })
                        return 'Product deleted successfully.';
                    }
                },
                error: (error) => {
                    return error.message;
                }
            }
        )
    }

    // Pagination
    const handleTableChange = (pagination, filters, sorter) => {
        console.log(pagination, filters, sorter);
        setFilters({
            pagination,
            order: sorter.order,
            sort: sorter.field
        })
    }

    return (
        <div>
            <Modal
                open={isProductModalOpen}
                onCancel={handleModalCancel}
                title="Add new product"
                footer={[
                    <Button onClick={handleModalCancel} key={'cancel'}>Cancle</Button>,
                    <Button key={'publish'} htmlType="submit" type="primary" form="product_add_form">Publish</Button>
                ]}
                centered
                maskClosable={false}
                width={1200}
            >
                <div style={{ maxHeight: 'calc(100vh - 150px)' }} className="overflow-x-auto">
                    <Form
                        form={form}
                        layout="vertical"
                        id="product_add_form"
                        onFinish={handleAddProductFormSubmit}
                        initialValues={editProduct}
                    >
                        <div className="flex">
                            <div className="w-1/2 px-2">
                                <Form.Item label="Product Title" name={'title'} extra={formErrors.title ? <p className="text-red-500">{formErrors.title}</p> : ''} >
                                    <Input status={formErrors.title ? 'error' : ''} type="text" placeholder="Enter product title" />
                                </Form.Item>

                                <Form.Item label="Description" name={"description"}>
                                    <Input.TextArea placeholder="Enter description" />
                                </Form.Item>

                                <Form.Item>
                                    <div className="max-h-[200px] w-auto overflow-y-scroll overflow-x-clip p-2 border rounded-lg">
                                        <RecursiveCategoryRender ulKey={uid.rnd()} categories={categories} />
                                    </div>
                                </Form.Item>

                                <div className="columns-2 mt-4">
                                    <Form.Item name={'price'} label="Price">
                                        <Input type="number" placeholder="Enter ammount" addonAfter={'$'} />
                                    </Form.Item>
                                    <Form.Item name={'discount_price'} label="Discount Price">
                                        <Input type="number" placeholder="Enter discount ammount" addonAfter={'$'} />
                                    </Form.Item>
                                </div>
                            </div>
                            <div className="w-1/2 px-2">
                                <Form.Item label="Upload Images">
                                    <p className="mb-2 text-text">First image will be product thumbnail.</p>
                                    <Upload
                                        listType="picture-card"
                                        fileList={fileList}
                                        onPreview={handleFilePreview}
                                        onChange={handleFileUploadChange}
                                        multiple
                                    >
                                        {fileList.length >= 8 ? null : uploadButton}
                                    </Upload>
                                    <Modal open={previewOpen} title={previewTitle} footer={null} onCancel={handleFileUploadCancel}>
                                        <img
                                            alt="example"
                                            style={{
                                                width: '100%',
                                            }}
                                            src={previewImage}
                                        />
                                    </Modal>
                                </Form.Item>

                                <Form.Item name={'stock'} label="Stock ammount">
                                    <InputNumber name="stock" placeholder="Stock ammount" addonAfter={"Pice"} />
                                </Form.Item>

                                <Form.Item name={'colors'} label="Select colors">
                                    <Checkbox.Group options={colors.values} />
                                </Form.Item>

                                <Form.Item name={'sizes'} label="Select Sizes">
                                    <Checkbox.Group options={sizes.values} />
                                </Form.Item>
                            </div>
                        </div>
                    </Form>
                </div>
            </Modal>

            {/* Products Table */}
            <div>
                <div className="flex justify-between mb-2 px-2">
                    <div><h1 className="text-heading font-semibold text-lg">All Products</h1></div>
                    <div>
                        <Button onClick={showProductAddModal} type="primary" icon={<PlusOutlined />}>Add New</Button>
                    </div>
                </div>
                <Card>
                    <Table loading={isTableLoading} dataSource={products} pagination={tableParams.pagination} rowKey={'_id'} onChange={handleTableChange}>
                        <Column sorter title="Title" key={'title'} render={(_, record) => <h3 className="text-base font-semibold text-heading">{record.title}</h3>} />
                        <Column
                            title={"Thumbnail"}
                            key={"thumbnail"}
                            render={(_, record) => {
                                return <img className="w-[50px] h-[50px] object-cover" src={`${import.meta.env.VITE_API_BASE_URL}/images/products/${record.images[0]}`} />
                            }}
                        />
                        <Column sorter title="Price" dataIndex={"price"} key={"price"} />
                        <Column title="Status" key={"status"} render={(_, record) => <span>{record.published ? 'Published' : ''}</span>} />
                        <Column sorter title="Stock" dataIndex={"stock"} key={"stock"} />
                        <Column
                            title="Action"
                            key={"action"}
                            render={(_, record) => {
                                return (
                                    <div className="flex gap-2">
                                        <Button data-id={record._id} onClick={handleEditClick} className="border-yellow-400">Edit</Button>
                                        <Popconfirm
                                            title="Delete Product"
                                            description="Are you sure to delete this product?"
                                            onConfirm={handleDeleteClick(record._id)}
                                        >
                                            <Button className="border-red-400">Delete</Button>
                                        </Popconfirm>
                                    </div>
                                )
                            }}
                        />
                    </Table>
                </Card>
            </div>
        </div>
    )
}

export default Products;