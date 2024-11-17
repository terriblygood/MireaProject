import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store/store";
import { setProducts } from "../../store/slices/productsSlice";
import { addItemToCart, increaseQuantity } from "../../store/slices/cartSlice";
import FilterSidebar from "../FilterSidebar/FilterSidebar";
import styles from "./ProductList.module.scss";
import { useNavigate } from "react-router-dom";

const categoryMap: { [key: string]: string } = {
  МЕРЧ: "MERCH",
  НЕМЕРЧ: "NOTMERCH",
  КАНЦЕЛЯРИЯ: "CHANCELLERY",
  СМАРТФОНЫ: "SMARTPHONES",
  НОУТБУКИ: "LAPTOPS",
  ГАДЖЕТЫ: "GADGETS",
  ТЕЛЕВИЗОРЫ: "TVS",
  АУДИОТЕХНИКА: "AUDIO",
  "ИГРОВЫЕ КОНСОЛИ": "GAME_CONSOLES",
  "КОМПЬЮТЕРНЫЕ КОМПЛЕКТУЮЩИЕ": "COMPUTER_PARTS",
  ФОТОАППАРАТЫ: "CAMERAS",
  "УМНЫЕ ЧАСЫ": "SMARTWATCHES",
};

// Mock data для продуктов
const mockProducts = [
  {
    id: "1",
    name: "Смартфон A1",
    price: 10000,
    category: "СМАРТФОНЫ",
    inStock: true,
    imageUrl: "https://via.placeholder.com/150",
  },
  {
    id: "2",
    name: "Ноутбук B2",
    price: 50000,
    category: "НОУТБУКИ",
    inStock: true,
    imageUrl: "https://via.placeholder.com/150",
  },
  {
    id: "3",
    name: "Умные часы C3",
    price: 15000,
    category: "УМНЫЕ ЧАСЫ",
    inStock: false,
    imageUrl: "https://via.placeholder.com/150",
  },
];

const ProductList: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const products = useSelector(
    (state: RootState) => state.products.filteredItems
  );
  const allProducts = useSelector((state: RootState) => state.products.items);
  const cartItems = useSelector((state: RootState) => state.cart.items);

  const [uniqueCategories, setUniqueCategories] = useState<string[]>([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const formattedData = mockProducts.map((item) => ({
          id: Number(item.id), // Преобразуем id в number
          name: item.name,
          price: item.price,
          category: item.category.toUpperCase(),
          inStock: item.inStock,
          imageUrl: item.imageUrl,
        }));

        dispatch(setProducts(formattedData));

        const categories: string[] = Array.from(
          new Set(formattedData.map((item) => item.category))
        );
        setUniqueCategories(categories);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, [dispatch]);

  const handleAddToCart = (product: any) => {
    const existingCartItem = cartItems.find((item) => item.id === product.id);

    if (existingCartItem) {
      dispatch(increaseQuantity(product.id));
    } else {
      dispatch(
        addItemToCart({
          ...product,
          quantity: 1,
        })
      );
    }
  };

  return (
    <div className={styles.productPage}>
      <FilterSidebar
        categories={uniqueCategories}
        onResetFilters={() => {
          // Дополнительная логика для сброса фильтров
        }}
      />
      <div className={styles.productList}>
        {allProducts.length === 0 ? (
          <p className={styles.noProducts}>
            Пока тут пусто, но мы скоро все добавим!
          </p>
        ) : products.length === 0 ? (
          <p className={styles.noProducts}>
            По вашему запросу ничего не найдено.
          </p>
        ) : (
          products.map((product) => (
            <div key={product.id} className={styles.productCard}>
              <img
                src={product.imageUrl}
                onClick={() => navigate(`/thing/${product.id}`)}
                alt={product.name}
                className={styles.productImage}
              />
              <h3 className={styles.productName}>{product.name}</h3>
              <p className={styles.productPrice}>{product.price} к.</p>
              {product.inStock ? (
                <button
                  className={styles.addToCartButton}
                  onClick={() => handleAddToCart(product)}
                  disabled={!product.inStock}
                >
                  В корзину
                </button>
              ) : (
                <span>Товара нет в наличии</span>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ProductList;
