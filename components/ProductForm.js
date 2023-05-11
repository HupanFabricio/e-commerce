import axios from "axios";
import { useRouter } from "next/router";
import { useState } from "react";

export default function ProductForm({
    _id,
    title: existingTitle,
    description: existingDescription,
    price: existingPice,
    images
}) {

    const [title, setTitle] = useState(existingTitle || '');
    const [description, setDescription] = useState(existingDescription || '');
    const [price, setPrice] = useState(existingPice || '');
    const [goToProducts, setGoToProducts] = useState(false);
    const router = useRouter();

    async function saveProduct(ev) {
        ev.preventDefault();

        const data = { title, description, price };
        if (_id) {
            //update
            await axios.put('/api/products', { ...data, _id });
        } else {
            //create
            await axios.post('/api/products', data);
        }
        setGoToProducts(true);
    }
    if (goToProducts) {
        router.push('/products');
    }

    async function uploadImages(ev) {
        const files = ev.target?.files;
        if (files?.length > 0) {
            const data = new FormData();
            files.forEach(file => data.append('file', file));
            const res = await axios.post('/api/upload', data);
        }
    }

    return (
        <form onSubmit={saveProduct}>
            <label>Product name</label>
            <input
                type="text"
                placeholder="product name"
                value={title}
                onChange={ev => setTitle(ev.target.value)}
            />

            <label>
                Photos
            </label>
            <div className="mb-2">

                <label className="w-24 h-24 text-center flex items-center
                justify-center text-sm gap-1 text-gray-500 rounded-md bg-gray-200">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                    </svg>

                    <div>
                        add
                    </div>

                    <input onChange={uploadImages} type="file" className="hidden"></input>

                </label>

                {!images?.lenth && (
                    <div>No photos in this product</div>
                )}
            </div>

            <label>Description</label>
            <textarea
                placeholder="description"
                value={description}
                onChange={ev => setDescription(ev.target.value)}
            />
            <label>Price</label>
            <input
                type="number"
                placeholder="price"
                value={price}
                onChange={ev => setPrice(ev.target.value)}
            />
            <button
                type="submit"
                className="btn-primary"
            >
                Save
            </button>
        </form>
    );
}