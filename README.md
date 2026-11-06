# DevOpsHub Feedback System

A simple feedback collection system built with two Flask web apps sharing one Redis database, all running with Docker Compose.

## Overview

- **App 1 (Message Collector):** Displays a form to submit messages, counts page visits, and stores messages in a Redis list.
- **App 2 (Dashboard):** Shows the total number of messages and total page visits.
- **Redis:** Shared database with a persistent volume, so data is not lost after restart.

All services communicate using service names inside Docker Compose.

## Tech Stack

Python (Flask), Redis, Docker, Docker Compose