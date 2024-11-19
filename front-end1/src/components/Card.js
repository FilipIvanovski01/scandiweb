import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import emptyCart from "../img/emptyCart.svg";

export default class Card extends Component {
  constructor(props) {
    super(props)

    this.state = {
      showEmptyCart: false
    }
  }
  saveProductInCart = (product) => {
    let productsInCart = this.props.productsInCart
    const defaultAttributes = {};
    product.attributes.forEach(attribute => {
      defaultAttributes[attribute.id] = {
        id: attribute.id,
        value: attribute.items[0].value, 
        displayValue: attribute.items[0].displayValue 
      };
    });
    let newProduct = {
      ...product,
      selectedAttributes: { ...defaultAttributes },
      quantity: 1,
    }

    let sameProductInCart = false
    productsInCart.forEach((prod, index) => {
      if (prod.id === product.id) {
        let sameAttributes = true
        for (let attribute in prod.selectedAttributes) {
          if (defaultAttributes[attribute] !== prod.selectedAttributes[attribute]) {
            sameAttributes = false
            break
          }
        }
        if (sameAttributes) {
          sameProductInCart = true;
          productsInCart[index] = { ...productsInCart[index], quantity: productsInCart[index].quantity + 1 }
          this.props.productInCartsHendler(productsInCart)
          return
        }
      }
    })
    if(!sameProductInCart){
      productsInCart.push(newProduct);
      this.props.productInCartsHendler(productsInCart)
    }
  }

  render() {
    return (
      <div className="w-1/4 rounded-xl hover:shadow-lg p-6 transition mx-auto "
        onMouseLeave={() => { this.setState({ showEmptyCart: false }) }}
        onMouseEnter={() => { this.setState({ showEmptyCart: true }) }}>

        <Link
          to={`product/${this.props.product.id}`}
          data-testid={`product-${this.props.product.name.toLowerCase().replace(/\s+/g, '-')}`}
        >
          <div className="flex justify-center mb-6 relative">
            {!this.props.product.inStock ?
              (
                <div>
                  <div className="flex items-center text-gray-400 justify-center w-full h-full absolute bg-gray-300/50 left-0 top-0">
                    OUT OF STOCK
                  </div>
                  <img className="w-[354px] h-[330px]" src={this.props.product.gallery[0]} alt={this.props.product.name} />
                </div>
              ) :
              (
                <div>
                  <img className="w-[354px] h-[330px]" src={this.props.product.gallery[0]} alt={this.props.product.name} />
                  {this.state.showEmptyCart &&
                    <div
                      onClick={(e) => {
                        e.preventDefault()
                        this.saveProductInCart(this.props.product)
                      }}
                      className="rounded-full bg-green-400 h-12 w-12 flex items-center justify-center absolute bottom-[-5%] right-8 z-50">
                      <img src={emptyCart} />
                    </div>
                  }
                </div>
              )
            }
          </div>
          <div>
            <p className="font-thin">{this.props.product.name}</p>
            <p>{this.props.product.price.currencySymbol}{this.props.product.price.amount}</p>
          </div>
        </Link>
      </div>
    );
  }
}
