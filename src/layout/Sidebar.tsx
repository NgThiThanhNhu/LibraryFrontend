

const Sidebar = () => {
    return (
        <div >
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
