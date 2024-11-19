import React, { Component } from "react";
import cart from "../img/cart.svg";
import logo from "../img/logo.svg";
import { Link } from "react-router-dom";

export default class Header extends Component {
    render() {
        return (
            <>
                <div className="flex justify-between items-center px-20">
                    <div className="w-1/3 flex gap-8 justify-start">
                        {this.props.categories && this.props.categories.map((category, index) => (
                            <div
                                data-testid={
                                    this.props.selectedCategory === category
                                        ? 'active-category-link'
                                        : 'category-link'
                                }
                                className={
                                    this.props.selectedCategory === category
                                        ? "text-[#5ECE7B] border-b-2 border-[#5ECE7B] pb-4 px-4 cursor-pointer"
                                        : "pb-4 px-4 cursor-pointer"
                                }
                                onClick={() => this.props.selectedCategoryHandler(category)}
                                id={category}
                                key={index}
                            >
                                {category.toUpperCase()}
                            </div>
                        ))}
                    </div>
                    <div className="w-1/3 flex justify-center py-6">
                        <button><Link to='/'><img src={logo} alt="Logo" /></Link></button>
                    </div>
                    <div className="w-1/3 flex justify-end py-6">
                        <button className="relative" data-testid="cart-btn" onClick={()=> this.props.toggleCartVisibility()}>
                            {this.props.numberOfItemsInCart() > 0 &&
                             <div data-testid='cart-total' className="w-6 h-6 bg-black rounded-full absolute right-[-16px] top-[-2px] text-white"
                             >{this.props.numberOfItemsInCart()}</div>}
                            <img src={cart} alt="Cart" />
                        </button>
                    </div>
                </div>
            </>
        );
    }
}


