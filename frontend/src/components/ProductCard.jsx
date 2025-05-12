import {
    Card,
    CardHeader,
    CardBody,
    CardFooter,
    Typography,
    Button,
} from "@material-tailwind/react";
import { useState } from "react";
import toast, { Toaster } from "react-hot-toast";

export default function ProductCard() {
    // Example product data
    const products = [
        { id: 1, name: "T-shirt", price: 350, imageUrl: "https://codeswear.nyc3.cdn.digitaloceanspaces.com/tshirts/pack-of-five-plain-tshirt-white/1.webp" },
        { id: 2, name: "Jeans", price: 700, imageUrl: "https://codeswear.nyc3.cdn.digitaloceanspaces.com/tshirts/pack-of-five-plain-tshirt-white/1.webp" },
        { id: 3, name: "Shoes", price: 1200, imageUrl: "https://codeswear.nyc3.cdn.digitaloceanspaces.com/tshirts/pack-of-five-plain-tshirt-white/1.webp" },
    ];

    const [selectedProduct, setSelectedProduct] = useState(null);

    // handlePayment Function
    const handlePayment = async () => {
        if (!selectedProduct) {
            toast.error("Please select a product");
            return;
        }

        try {
            const res = await fetch(`${import.meta.env.VITE_BACKEND_HOST_URL}/api/payment/order`, {
                method: "POST",
                headers: {
                    "content-type": "application/json"
                },
                body: JSON.stringify({
                    amount: selectedProduct.price
                })
            });

            const data = await res.json();
            console.log(data);
            handlePaymentVerify(data.data)
        } catch (error) {
            console.log(error);
        }
    };

    // handlePaymentVerify Function
    const handlePaymentVerify = async (data) => {
        const options = {
            key: import.meta.env.RAZORPAY_KEY_ID,
            amount: data.amount,
            currency: data.currency,
            name: "Topsqill",
            description: "Test Mode",
            order_id: data.id,
            handler: async (response) => {
                console.log("response", response);
                try {
                    const res = await fetch(`${import.meta.env.VITE_BACKEND_HOST_URL}/api/payment/verify`, {
                        method: 'POST',
                        headers: {
                            'content-type': 'application/json'
                        },
                        body: JSON.stringify({
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature,
                        })
                    })

                    const verifyData = await res.json();

                    if (verifyData.message) {
                        toast.success(verifyData.message)
                    }
                } catch (error) {
                    console.log(error);
                }
            },
            theme: {
                color: "#5f63b8"
            }
        };
        const rzp1 = new window.Razorpay(options);
        rzp1.open();
    };

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 p-4">
            {products.map((product) => (
                <Card key={product.id} className="w-full bg-[#222f3e] text-white shadow-lg rounded-lg hover:shadow-xl transition-shadow duration-300">
                    {/* CardHeader */}
                    <CardHeader className="relative h-64 bg-[#2C3A47]">
                        {/* Image */}
                        <img
                            src={product.imageUrl}
                            alt="card-image"
                            className="w-full h-full object-cover rounded-t-lg"
                        />
                    </CardHeader>

                    {/* CardBody */}
                    <CardBody className="p-4">
                        {/* Typography For Title */}
                        <Typography variant="h5" className="mb-2 font-semibold text-lg">
                            {product.name}
                        </Typography>

                        {/* Typography For Price */}
                        <Typography className="text-xl font-bold text-[#1B9CFC]">
                            ₹{product.price} <span className="text-sm text-gray-400 line-through">₹699</span>
                        </Typography>
                    </CardBody>

                    {/* CardFooter */}
                    <CardFooter className="pt-0 pb-4 px-4">
                        {/* Buy Now Button */}
                        <Button 
                            onClick={() => setSelectedProduct(product)} 
                            className="w-full bg-[#1B9CFC] hover:bg-[#1893D6] text-white"
                        >
                            Buy Now
                        </Button>
                    </CardFooter>
                </Card>
            ))}

            {/* Trigger Payment for the Selected Product */}
            {selectedProduct && (
                <Button 
                    onClick={handlePayment} 
                    className="w-full bg-[#1B9CFC] mt-4 text-white hover:bg-[#1893D6]"
                >
                    Proceed to Payment for {selectedProduct.name}
                </Button>
            )}

            <Toaster />
        </div>
    );
}
