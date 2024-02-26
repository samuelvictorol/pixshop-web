

export default function useCartService() {
    const addItem = (item) => {
        
    },
    checkCart = () => {
        if (localStorage.getItem('cart') === null) {
            let cart = [];
            localStorage.setItem('cart', JSON.stringify(cart));
            console.log('Cart criado com sucesso');
        } else {
            let cart = JSON.parse(localStorage.getItem('cart'));
            return cart;
        }
    }

    return {
        addItem
    };
}