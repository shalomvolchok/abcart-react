const MyCart = () => (
    <CartPreset>
        {({ items, total }) => (
            <div>
                <h1>Shopping Cart</h1>
                {items.map(({ item, remove, update }) => (
                    <div>
                        {item.sku} | {item.metadata.name}
                        <button onClick={remove}>Remove</button>
                        <select onChange={update}>
                            <option value={1}>1</option>
                            <option value={2}>2</option>
                            <option value={3}>3</option>
                        </select>
                    </div>
                ))}
                <h3>Cart Total: {total}</h3>
            </div>
        )}
    </CartPreset>
);

// in update check for either e.target.value if e is not an integer
