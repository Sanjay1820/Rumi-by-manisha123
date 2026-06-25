export interface Review {
    id: number;
    name?: string;
    author_name?: string;
    location?: string;
    rating: number;
    text?: string;
    comment?: string;
    title?: string;
    verified_purchase?: boolean | number;
    product?: string;
    product_name?: string;
    status?: string;
    created_at?: string;
}

export const reviewsByProductId: Record<string, Review[]> = {
    "1": [ // Banarasi Silk Saree
        {
            id: 101,
            name: "Aditi Rao",
            location: "Hyderabad",
            rating: 5,
            text: "The silk quality is authentic and the zari work is breathtaking. Wore it to my sister's wedding and got so many compliments.",
            product: "Royal Blue"
        },
        {
            id: 102,
            name: "Sneha Kapoor",
            location: "Delhi",
            rating: 5,
            text: "Packaged beautifully. The saree looks even better in person than in the photos. Worth the investment.",
            product: "Maroon"
        },
        {
            id: 103,
            name: "Pooja Mehta",
            location: "Mumbai",
            rating: 4,
            text: "Lovely saree, slightly heavy but manageable. The color is very rich.",
            product: "Emerald Green"
        }
    ],
    "2": [ // Embroidered Lehenga
        {
            id: 201,
            name: "Kiara Advani",
            location: "Chandigarh",
            rating: 5,
            text: "My dream lehenga! The fitting service was excellent and the embroidery is so detailed. Felt like a princess.",
            product: "Bridal Red"
        },
        {
            id: 202,
            name: "Riya Sen",
            location: "Kolkata",
            rating: 5,
            text: "Heavy and premium quality. The dupatta work is exceptionally good.",
            product: "Pink"
        }
    ],
    "3": [ // Designer Anarkali
        {
            id: 301,
            name: "Ananya Panday",
            location: "Mumbai",
            rating: 5,
            text: "Perfect fit! I was worried about the length but it was just right. Very elegant for evening parties.",
            product: "Navy Blue"
        },
        {
            id: 302,
            name: "Sara Ali Khan",
            location: "Lucknow",
            rating: 4,
            text: "Comfortable fabric and looks very classy. Delivery was a bit slow but worth the wait.",
            product: "Maroon"
        },
        {
            id: 303,
            name: "Jhanvi K",
            location: "Chennai",
            rating: 5,
            text: "The flair of the Anarkali is amazing. Twirls beautifully!",
            product: "Teal"
        }
    ],
    "4": [ // Chanderi Suit
        {
            id: 401,
            name: "Nita Ambani",
            location: "Ahmedabad",
            rating: 5,
            text: "The cotton is so soft and breathable. Perfect for Gujarat summers. The block print is very authentic.",
            product: "Mustard"
        },
        {
            id: 402,
            name: "Isha P",
            location: "Jaipur",
            rating: 5,
            text: "Elegant and simple. Stiching quality is top notch.",
            product: "Sage Green"
        }
    ],
    "5": [ // Kanjivaram
        {
            id: 501,
            name: "Rekha G",
            location: "Chennai",
            rating: 5,
            text: "A timeless classic. The kanjivaram silk is pure and the border work is traditional perfection.",
            product: "Temple Red"
        },
        {
            id: 502,
            name: "Vidya Balan",
            location: "Kochi",
            rating: 5,
            text: "Bought this for my mom and she loved it! The fabric sheen is luxurious.",
            product: "Purple"
        }
    ],
    "6": [ // Bridal Lehenga Set
        {
            id: 601,
            name: "Deepika P",
            location: "Bangalore",
            rating: 5,
            text: "Absolutely regal! The velvet quality is premium and the zardozi work shines.",
            product: "See-Through"
        },
        {
            id: 602,
            name: "Katrina K",
            location: "London",
            rating: 5,
            text: "International shipping was secure. The lehenga arrived in perfect condition. It's heavy but stunning.",
            product: "Royal Maroon"
        }
    ],
    "default": [
        {
            id: 1,
            name: "Priya Sharma",
            location: "Mumbai",
            rating: 5,
            text: "Absolutely stunning saree! The craftsmanship is impeccable and the fabric quality exceeded my expectations. Will definitely be ordering again.",
            product: "Silk Banarasi Saree",
        },
        {
            id: 2,
            name: "Ananya Patel",
            location: "Toronto",
            rating: 5,
            text: "Found my dream wedding lehenga here! The team was so helpful with customization. International shipping was smooth and the packaging was beautiful.",
            product: "Bridal Lehenga",
        },
        {
            id: 3,
            name: "Meera Reddy",
            location: "Bangalore",
            rating: 5,
            text: "The attention to detail in every piece is remarkable. I've ordered multiple times and each time the quality has been consistent. Truly worth every penny!",
            product: "Designer Anarkali",
        },
        {
            id: 4,
            name: "Sanya Gupta",
            location: "Delhi",
            rating: 5,
            text: "The fabric is so soft and the fit is perfect. I received so many compliments at the party. Highly recommended!",
            product: "Velvet Suit Set",
        },
        {
            id: 5,
            name: "Rachel Green",
            location: "New York",
            rating: 5,
            text: "I was skeptical about ordering traditional wear online, but this experience changed my mind. The support team helped me pick the right size.",
            product: "Embroidered Kurta",
        }
    ]
};

export const getReviewsForProduct = (productId: string): Review[] => {
    return reviewsByProductId[productId] || reviewsByProductId["default"];
};
