import React, { Component } from "react";
import { FetchData } from "./components/functions/fetch";
import {Categories} from "./components/functions/categoryType"
import MainPage from "./containers/productsPage/MainPage";
import ProductDisplayPage from "./containers/PDP/ProductDisplayPage";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Header from "./components/Header";
import Cart from "./components/Cart";

export default class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      products: null,
      categories: null,
      selectedCategory: "ALL",
      cartVisibility: false,
      productInCarts: [],
      loading: true,
      error: null,
    };
  }

  componentDidMount() {
    FetchData("http://localhost:8000/graphql")
      .then((data) => {
        this.setState({
          products: data.data.products,
          categories: Categories(data.data.products),
          loading: false,     
        });
      })
      .catch((error) => {
        this.setState({ error, loading: false })
      });
  }
  countItemsInCart = () => {
    let items = 0
    this.state.productInCarts.forEach((product)=>{
      items += product.quantity
    })
    return items
  }
  productInCartsHendler = (products) => {
    this.setState({ productInCarts: products })
  };

  selectedCategoryHandler = (category) => {
    this.setState({ selectedCategory: category })
  };

  toggleCartVisibility = () => {
    this.setState((prevState) => ({
      cartVisibility: !prevState.cartVisibility,
    }));
  };

  render() {
    const {
      products,
      categories,
      selectedCategory,
      cartVisibility,
      loading,
      error,
    } = this.state;

    if (loading) {
      return <div className="flex items-center justify-center h-screen">Loading...</div>
    }

    if (error) {
      return (
        <div className="flex items-center justify-center h-screen text-red-500">
          Something went wrong. Try again.
        </div>
      );
    }

    return (
      <>
        <BrowserRouter>
        <Header
          categories={categories}
          selectedCategory={selectedCategory}
          selectedCategoryHandler={this.selectedCategoryHandler}
          toggleCartVisibility={this.toggleCartVisibility}
          numberOfItemsInCart={this.countItemsInCart}
        />
        {cartVisibility && <Cart toggleCartVisibility={this.toggleCartVisibility} 
                            productsInCart={this.state.productInCarts} 
                            productInCartsHendler={this.productInCartsHendler} />}
          <Routes>
            <Route
              path="/"
              element={
                <MainPage
                  products={products}
                  categories={categories}
                  selectedCategory={selectedCategory}
                  selectedProductHandler={this.selectedProductHandler}
                  productsInCart={this.state.productInCarts}
                  productInCartsHendler={this.productInCartsHendler}
                />
              }
            />
            <Route
              path="/product/:id"
              element={
                <ProductDisplayPage 
                productInCartsHendler={this.productInCartsHendler} 
                productsInCart={this.state.productInCarts} 
                toggleCartVisibility={this.toggleCartVisibility}
                />
              }
            />
          </Routes>
        </BrowserRouter>
      </>
    );
  }
}
