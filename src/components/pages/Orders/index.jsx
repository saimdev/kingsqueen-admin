import { Button, Form, Modal, Popconfirm, Select, Table } from "antd";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";


const Orders = () => {
    const [orders, setOrders] = useState([]);
    const [isTableLoading, setIsTableLoading] = useState(false);
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 10,
        total: 50,
    });
    const [tableOptions, setTableOptions] = useState({});
    const [editId, setEditId] = useState(null);
    const [previewOrder, setPreviewOrder] = useState(null);
    const [isModalVisible, setIsModalVisible] = useState(false);

    const [form] = Form.useForm();

    const fetchOrders = async () => {
        // Fetch all categories from the API and set the state
        // Also handle pagination, sorting, and filtering
        let searchParamOptions = {};
        let url = new URL(import.meta.env.VITE_API_BASE_URL + '/admin/orders');

        if (tableOptions.pagination?.current) searchParamOptions.page = tableOptions.pagination.current;
        if (tableOptions.pagination?.pageSize && tableOptions.pagination.pageSize > 2) searchParamOptions.limit = tableOptions.pagination.pageSize;
        if (tableOptions.sorter?.column) searchParamOptions.sort = tableOptions.sorter.field;
        if (tableOptions.sorter?.order) searchParamOptions.order = tableOptions.sorter.order.replace('end', '');

        url.search = new URLSearchParams(searchParamOptions).toString();

        try {
            setIsTableLoading(true);
            const response = await fetch(url);
            if (response.status == 200) {
                const result = await response.json();
                console.log(result.data)
                setOrders(result.data);
                setPagination(result.pagination)
                setIsTableLoading(false);
            }
        } catch (err) {
            console.log(err)
        }
    };

    useEffect(() => {
        fetchOrders();
    }, [])

    useEffect(() => {
        fetchOrders();
    }, [tableOptions])

    const handleTableChange = (pagination, filters, sorter) => {
        // Handle table sorting and pagination here
        setTableOptions({ pagination, filters, sorter });
    };

    const handleEdit = async (event) => {
        // Fetch category details and populate the form values
        const id = event.currentTarget.dataset.id;

        try {
            const response = await fetch(import.meta.env.VITE_API_BASE_URL + '/admin/orders/' + id);
            if (response.status == 200) {
                const result = await response.json();
                console.log(result.data)
                setIsModalVisible(true);
                setEditId(result.data._id);
                result.data.shippingAddress = JSON.parse(result.data.shippingAddress);
                setPreviewOrder(result.data);
                form.setFieldsValue({
                    orderStatus: result.data.orderStatus
                })
            }
        } catch (err) {
            console.log(err)
        }
    }

    const handleDelete = (id) => async () => {
        console.log(id)
        const deleteToast = toast.loading('Deleting order...');
        try {
            const response = await fetch(import.meta.env.VITE_API_BASE_URL + '/admin/orders/' + id, {
                method: 'DELETE',
                credentials: 'include',
            });
            if (response.status == 200) {
                toast.success('Order deleted successfully', { id: deleteToast });
                fetchOrders();
            } else {
                toast.error('Error deleting order', { id: deleteToast });
            }
        } catch (err) {
            toast.error('Error deleting order', { id: deleteToast });
        }
    }

    const handleSubmitForm = () => {
        form.validateFields().then(async (values) => {
            const savingToast = toast.loading('Saving order...');
            const url = import.meta.env.VITE_API_BASE_URL + '/admin/orders/' + editId;
            const method = 'PATCH';

            try {
                const response = await fetch(url, {
                    method,
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(values),
                    credentials: 'include',
                })

                if (response.status === 200) {
                    const result = await response.json();
                    toast.success('Saved order successfully', { id: savingToast });
                    fetchOrders();
                    setIsModalVisible(false);
                } else {
                    const result = await response.json();
                    toast.error('Error saving order', { id: savingToast });
                }

            } catch (error) {
                console.error('Error saving order:', error);
                toast.error('Error saving order', { id: savingToast });
            }
        })
            .catch((error) => {
                toast.error('Please fill in all required fields', { id: savingToast });
            })
    };

    const handleCancel = () => {
        setIsModalVisible(false);
        form.resetFields();
        setEditId(null);
    }

    const columns = [
        {
            title: 'Order Number',
            dataIndex: 'orderNumber',
            key: 'orderNumber',
        },
        {
            title: 'Customer',
            dataIndex: 'userName',
            key: 'userName',
            sorter: true,
        },
        {
            title: 'Date',
            key: 'createdAt',
            render: (_, record) => record.createdAt.split('T')[0],
            sorter: true,
        },
        {
            title: 'Status',
            dataIndex: 'orderStatus',
            key: 'orderStatus',
            sorter: true,
        },
        {
            title: 'Total',
            dataIndex: 'totalAmount',
            key: 'totalAmount',
            sorter: true,
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_, record) => (
                <div className="flex">
                    <Button onClick={handleEdit} data-id={record._id} type="link">View / Edit</Button>
                    <Popconfirm
                        title="Delete Category"
                        description="Are you sure to delete this order?"
                        onConfirm={handleDelete(record._id)}
                    >
                        <Button type="link">Delete</Button>
                    </Popconfirm>
                </div>
            )
        }
    ];

    return (
        <div>
            <div className="flex justify-between mb-2 px-2">
                <div><h1 className="text-heading font-semibold text-lg">All Categories</h1></div>
                <div>
                </div>
            </div>

            <Table
                columns={columns}
                dataSource={orders}
                pagination={pagination}
                onChange={handleTableChange}
                rowKey={'_id'}
                loading={isTableLoading}
            />

            <Modal
                title="Add New Category"
                open={isModalVisible}
                onOk={handleSubmitForm}
                onCancel={handleCancel}
                okText="Update"
                centered
                width={700}
            >
                <div style={{ maxHeight: 'calc(100vh - 200px)' }} className="overflow-x-auto">
                    <Form form={form}>
                        <Form.Item name={'orderStatus'} label="Status" required>
                            <Select>
                                <Select.Option value="Pending Payment">Pending</Select.Option>
                                <Select.Option value="Processing">Processing</Select.Option>
                                <Select.Option value="Shipped">Shipped</Select.Option>
                                <Select.Option value="Delivered">Delivered</Select.Option>
                                <Select.Option value="Cancelled">Cancelled</Select.Option>
                            </Select>
                        </Form.Item>
                    </Form>

                    <div className="flex gap-4">
                        <div>
                            <div>
                                <h2 className="text-lg font-bold mb-2">Order Details</h2>
                                <div className="flex gap-4">
                                    <p className="font-semibold">Order Number:</p>
                                    <p>{previewOrder?.orderNumber}</p>
                                </div>
                                <div className="flex gap-4">
                                    <p className="font-semibold">Customer:</p>
                                    <p>{previewOrder?.userName}</p>
                                </div>
                                <div className="flex gap-4">
                                    <p className="font-semibold">Order Date:</p>
                                    <p>{previewOrder?.createdAt}</p>
                                </div>
                                <div className="flex gap-4">
                                    <p className="font-semibold">Order Status:</p>
                                    <p>{previewOrder?.orderStatus}</p>
                                </div>
                            </div>

                            <div className="mt-4">
                                <h2 className="text-lg font-bold mb-2">Shipping Address</h2>
                                <div className="flex gap-4">
                                    <p className="font-semibold">First Name:</p>
                                    <p>{previewOrder?.shippingAddress.f_name}</p>
                                </div>
                                <div className="flex gap-4">
                                    <p className="font-semibold">Last Name:</p>
                                    <p>{previewOrder?.shippingAddress.l_name}</p>
                                </div>
                                <div className="flex gap-4">
                                    <p className="font-semibold">City:</p>
                                    <p>{previewOrder?.shippingAddress.city}</p>
                                </div>
                                <div className="flex gap-4">
                                    <p className="font-semibold">State:</p>
                                    <p>{previewOrder?.shippingAddress.state}</p>
                                </div>
                                <div className="flex gap-4">
                                    <p className="font-semibold">Country:</p>
                                    <p>{previewOrder?.shippingAddress.country}</p>
                                </div>
                                <div className="flex gap-4">
                                    <p className="font-semibold">Zip Code:</p>
                                    <p>{previewOrder?.shippingAddress.zip}</p>
                                </div>
                                <div className="flex gap-4">
                                    <p className="font-semibold">Street 1:</p>
                                    <p>{previewOrder?.shippingAddress.street_1}</p>
                                </div>
                                <div className="flex gap-4">
                                    <p className="font-semibold">Street 2:</p>
                                    <p>{previewOrder?.shippingAddress.street_2}</p>
                                </div>
                                <div className="flex gap-4">
                                    <p className="font-semibold">Phone:</p>
                                    <p>{previewOrder?.shippingAddress.phone}</p>
                                </div>
                                <div className="flex gap-4">
                                    <p className="font-semibold">Shipping Method:</p>
                                    <p>{previewOrder?.shippingAddress.shipping_method}</p>
                                </div>
                            </div>
                        </div>
                        <div>
                            <h2 className="text-lg font-bold mb-2">Items</h2>
                            <div>
                                {
                                    previewOrder?.items.map((item, index) => (
                                        <>
                                            <div key={index}>
                                                <p className="font-semibold">{item.title}</p>
                                                <p>Quantity: {item.qty}</p>
                                                <p>Price: {item.price}</p>
                                                <p>Color: {item.color}</p>
                                                <p>Size: {item.selectedSize}</p>
                                            </div>
                                            <hr className="my-2" />
                                        </>
                                    ))
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </Modal >
        </div >
    )
}

export default Orders