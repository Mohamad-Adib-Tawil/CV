# LKLK Live — CV Description

## Project Name
**LKLK Live** — Real-Time Social Audio Chat Platform

## Role
**Flutter Developer** (Full-Stack Mobile)

## Technologies
Flutter · Dart · flutter_bloc (Cubit) · GetIt · Dio · Appwrite · LiveKit · ZEGOCLOUD (ZegoExpress + ZIM) · Hive · flutter_secure_storage · SharedPreferences · Google Sign-In · in_app_purchase · background_downloader · flutter_foreground_task · SVGA/VAP animation · FFmpeg · flutter_screenutil · Google Mobile Ads · WebSocket · flutter_intl (AR/EN)

---

## ATS-Optimized Bullet Points

- Engineered a **production-grade real-time social audio platform** in Flutter (v2.2.82) supporting live audio rooms with up to 500 concurrent users, integrating dual audio SDKs (**ZEGOCLOUD ZegoExpress** and **LiveKit**) for low-latency voice streaming with dynamic microphone seat management, echo cancellation, and noise suppression.

- Designed and implemented a **feature-based modular architecture** following Clean Architecture principles (domain / data / presentation layers) with **flutter_bloc Cubits** as the primary state management solution and **GetIt** as the service locator for dependency injection, resulting in a scalable and testable codebase spanning 13+ feature modules.

- Built a **high-performance virtual gift animation engine** capable of queuing and playing concurrent SVGA and VAP animations (up to 8 simultaneous gift animations), backed by a background asset downloader with adaptive bandwidth policy, a global download orchestrator, and Appwrite Realtime / WebSocket event streams for synchronized gift delivery across all room participants.

- Developed a **multi-tier VIP and gamification system** including VIP frames, entry animations, shield badges, a coin-based economy with 6 in-app purchase tiers (Google Play `in_app_purchase`), a lucky bag / money bag mechanic, weekly star leaderboards, task-based leveling, and CP/Wakala challenge events.

- Implemented a **secure, layered authentication flow** combining Google Sign-In with a custom token-based REST API (Dio + `AppConfig`), migrating legacy tokens from SharedPreferences to `flutter_secure_storage` with a 30-minute in-memory cache, and using **Hive** for offline user entity persistence.

- Achieved comprehensive **performance and UX optimizations** including `flutter_screenutil` responsive layout (360×756 design canvas), shimmer/skeletonizer loading states, optimized chat message capping (25 live / 50 cached), custom page transitions, foreground service continuity for audio rooms, and an Icecast-backed in-room music streaming pipeline with FFmpeg audio processing.
