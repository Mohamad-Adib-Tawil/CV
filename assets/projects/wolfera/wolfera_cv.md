# Wolfera — CV Description

**Project Name:** Wolfera — Car Marketplace  
**Role:** Flutter Developer (Full-Stack Mobile)  
**Technologies:** Flutter · Dart · Supabase · Firebase · BLoC/Cubit · GoRouter · GetIt + Injectable · Freezed · Easy Localization · TFLite

---

## CV Bullet Points

- Developed a full-featured bilingual (Arabic/English) car marketplace app using **Flutter** and **Dart**, supporting car listing, browsing, buying, selling, and rental with multi-tier pricing (daily/weekly/monthly/yearly).
- Implemented **Clean Architecture** with feature-based modular structure, **BLoC/Cubit** for state management, and **GetIt + Injectable** for dependency injection, resulting in a scalable and maintainable codebase (~385 Dart files across 10+ feature modules).
- Integrated **Supabase** as the primary backend for PostgreSQL database, authentication (email/password, Google Sign-In, Apple Sign-In with nonce flow), Realtime subscriptions for live in-app chat, and object storage for car images.
- Built an admin car approval workflow with role-based access control (admin/super-admin), push notifications via **Firebase Cloud Messaging** and `flutter_local_notifications`, including automated price-change alerts for users who favorited a car.
- Integrated an on-device **TFLite NSFW content moderation model** to validate car images before upload, and implemented **Firebase Crashlytics** with a custom recoverable-error filter to suppress transient network noise from crash reports.
- Engineered a multi-step car listing wizard with `reactive_forms` validation, **Supabase Storage** image upload with `flutter_image_compress`, advanced search & filtration across 15+ dimensions (make, model, year, price, transmission, fuel type, body type, cylinders, mileage), and infinite scroll pagination.
