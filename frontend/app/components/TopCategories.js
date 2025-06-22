"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import Loading from "../loading";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import styles from './TopCategories.module.css';

export default function TopCategories() {
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_STRAPI_HOST}/api/categories?populate=*&sort=createdAt:asc`,
          {
            headers: {
              Authorization: `Bearer ${process.env.NEXT_PUBLIC_STRAPI_TOKEN}`,
              "Content-Type": "application/json",
            },
          }
        );
        if (!response.ok) {
          throw new Error("Failed to fetch categories");
        }
        const data = await response.json();
        setCategories(data.data || []);
      } catch (error) {
        console.error("Error fetching categories:", error);
        toast.error("Failed to load categories");
      } finally {
        setIsLoading(false);
      }
    };
    fetchCategories();
  }, []);

  if (isLoading) return <Loading />;
  if (categories.length === 0) return;
  return (
    <div className="md:w-[80%] w-full mx-auto p-2">
      <h2 className="md:text-2xl text-xl font-bold mb-4">Top Categories</h2>
      <div className={styles.sliderWrapper}>
        <Swiper
          modules={[Navigation]}
          spaceBetween={16}
          slidesPerView={2}
          navigation
          breakpoints={{
            480: {
              slidesPerView: 2,
              spaceBetween: 16,
            },
            640: {
              slidesPerView: 3,
              spaceBetween: 20,
            },
            768: {
              slidesPerView: 4,
              spaceBetween: 24,
            },
            1024: {
              slidesPerView: 5,
              spaceBetween: 28,
            },
            1280: {
              slidesPerView: 6,
              spaceBetween: 32,
            },
          }}
          className={styles.swiper}
        >
          {categories.map((category) => (
            <SwiperSlide key={category.id} className={styles["swiper-slide"]}>
              <Link
                href={`/category/${category.name}`}
                className={styles.categoryCard}
              >
                <img
                  src={category.image?.url || "/fallback.png"}
                  alt={category.name}
                  className={styles.categoryImage}
                />
                <p className={styles.categoryName}>
                  {category.name.replace(/-/g, " ")}
                </p>
              </Link>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
}
