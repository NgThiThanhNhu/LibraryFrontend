

const Sidebar = () => {
    return (
        <div style={{ width: "250px", backgroundColor: "f5f5f5", padding: "20px" }}>
            <h3>Quản lý</h3>
            <ul style={{ listStyle: "none", padding: 0 }}>
                <li><a href="/publishers">Nhà xuất bản</a></li>
                <li><a href="/books">Sách</a></li>
                <li><a href="/orders">Đơn hàng</a></li>
                <li><a href="/users">Người dùng</a></li>
            </ul>
        </div>
    );
};

export default Sidebar;
