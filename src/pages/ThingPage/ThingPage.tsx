import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import style from "./ThingPage.module.scss";
import {
  CarouselProvider,
  Slider,
  Slide,
  ButtonBack,
  ButtonNext,
  ImageWithZoom,
} from "pure-react-carousel";
import "pure-react-carousel/dist/react-carousel.es.css";
import SideBar from "../../components/SideBar/SideBar";
import WholePage from "../../components/WholePage/WholePage";
import MainContent from "../../components/MainContent/MainContent";
import Button from "../../components/Button/Button";
import { notifySuccess } from "../../toasters";
import Modal from "../../components/Modal/Modal";
import UpdateThingForm from "../../components/UpdateThingForm/UpdateThingForm";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store/store";
import { addItemToCart, increaseQuantity } from "../../store/slices/cartSlice";

// Моковые данные
const mockProducts = [
  {
    id: 1,
    name: "Худи",
    description:
      "Свитер или свитшот из мягкого хлопчатобумажного трикотажа или флиса с капюшоном, а также боковыми скрытыми карманами.",
    color: "Красный",
    size: "XL",
    count: 5,
    price: 2999,
    category: "Одежда",
    brand: "Т1",
    photos: [
      "https://via.placeholder.com/150",
      "https://via.placeholder.com/150/FF0000",
      "https://via.placeholder.com/150/00FF00",
    ],
  },
  {
    id: 2,
    name: "Смартфон A1",
    description: "Описание для смартфона A1.",
    color: "Черный",
    size: "6.5 дюймов",
    count: 10,
    price: 10000,
    category: "СМАРТФОНЫ",
    brand: "Brand A",
    photos: [
      "https://via.placeholder.com/150",
      "https://via.placeholder.com/150/0000FF",
    ],
  },
];

export default function ThingPage(): JSX.Element {
  const [modalActive, setModalActive] = useState<boolean>(false);
  const [thing, setThing] = useState<any>(null);
  const navigate = useNavigate();
  const params = useParams();
  const dispatch = useDispatch();
  const cartItems = useSelector((state: RootState) => state.cart.items);

  const isAdmin = localStorage.getItem("isAdmin");
  const isAdminBool = isAdmin ? JSON.parse(isAdmin) || false : false;

  
  const getThing = (): void => {
    const productId = Number(params.id);
    const product = mockProducts.find((item) => item.id === productId);
    if (product) {
      setThing(product);
    } else {
      console.error("Товар не найден");
      navigate("/");
    }
  };

  const deleteThing = (): void => {
    notifySuccess("Товар успешно удален (мок данные).");
    navigate("/");
  };

  const handleAddToCart = () => {
    const existingCartItem = cartItems.find((item) => item.id === thing.id);

    if (existingCartItem) {
      dispatch(increaseQuantity(thing.id));
    } else {
      dispatch(
        addItemToCart({
          ...thing,
          quantity: 1,
        })
      );
    }
    notifySuccess("Товар добавлен в корзину!");
  };

  useEffect(() => {
    getThing();
  }, []);

  if (!thing) {
    return <div>Loading...</div>;
  }

  return (
    <WholePage>
      <div className={style.mainContent}>
        <div className={style.topNaming}>
          <Button color="blue" onClick={() => navigate(-1)}>
            <span style={{ fontSize: "1.2rem" }}>{"<"} Назад</span>
          </Button>
          {isAdminBool ? (
            <>
              <Button color="danger" onClick={deleteThing}>
                Удалить товар
              </Button>
              <Button
                color="blue"
                onClick={() => setModalActive((prev) => !prev)}
              >
                Обновить товар
              </Button>
            </>
          ) : null}
          <Modal active={modalActive} setActive={setModalActive}>
            <UpdateThingForm
              setActive={setModalActive}
              initialThing={thing}
              id={params.id ?? ""}
            />
          </Modal>
        </div>
        <div className={style.mainWrapper}>
          <SideBar>
            <div className={`${style.photoBlock}`}>
              <CarouselProvider
                naturalSlideWidth={100}
                naturalSlideHeight={100}
                totalSlides={thing.photos.length}
              >
                <Slider>
                  {thing.photos.map((photo: string, index: number) => (
                    <Slide key={`img-${index}`} index={index}>
                      <ImageWithZoom
                        className={`${style.photo}`}
                        src={photo}
                        alt="Вещь"
                      />
                    </Slide>
                  ))}
                </Slider>
                <ButtonBack>Back</ButtonBack>
                <ButtonNext>Next</ButtonNext>
              </CarouselProvider>
            </div>
          </SideBar>
          <MainContent>
            <h1>{thing.name.charAt(0).toUpperCase() + thing.name.slice(1)}</h1>

            <div className={style.category}>{thing.category}</div>
            <div className={style.oneLine}>{thing.size}</div>
            <div className={style.oneLine}>{thing.color}</div>
            <div className={style.oneLine}>Остаток: {thing.count} шт.</div>
            <div className={style.oneLine}>Стоимость: {thing.price} к.</div>

            <div className={style.address}>{thing.description}</div>
            {thing.count ? (
              <Button color="green" onClick={handleAddToCart}>
                Добавить в корзину
              </Button>
            ) : (
              <h2>Товара нет в наличии</h2>
            )}
          </MainContent>
        </div>
      </div>
    </WholePage>
  );
}
