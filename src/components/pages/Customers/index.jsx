import { Table } from "antd"


const Customers = () => {
    const data = [
        {
            "_id": "65a101f9e8cde8e3b9575a95",
            "name": "Man",
            "slug": "man",
            "children": [
                {
                    "_id": "65a1020fe8cde8e3b9575a9d",
                    "name": "Bags",
                    "slug": "man_bags",
                    "children": [],
                    "parent": "65a101f9e8cde8e3b9575a95",
                    "createdAt": "2024-01-12T09:10:39.097Z",
                    "updatedAt": "2024-01-12T09:11:18.941Z",
                    "__v": 1
                }
            ],
            "createdAt": "2024-01-12T09:10:17.549Z",
            "updatedAt": "2024-01-12T09:10:39.103Z",
            "__v": 1
        }
    ]

    const columns = [
        {
            title: 'Name',
            key: 'name',
            dataIndex: 'name'
        },
        {
            title: 'Slug',
            key: 'slug',
            dataIndex: 'slug'
        }
    ]

    return (
        <div>
            <Table columns={columns} dataSource={data} rowKey={'_id'} />
        </div>
    )
}

export default Customers