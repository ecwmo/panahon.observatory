-- CreateTable
CREATE TABLE "users" (
    "id" BIGSERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "email_verified_at" TIMESTAMP(0),
    "password" VARCHAR(255) NOT NULL,
    "remember_token" VARCHAR(100),
    "created_at" TIMESTAMP(0) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(0),

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "roles" (
    "id" BIGSERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "description" VARCHAR(255),
    "created_at" TIMESTAMP(0) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(0),

    CONSTRAINT "roles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "role_user" (
    "role_id" BIGINT NOT NULL,
    "user_id" BIGINT NOT NULL,
    "created_at" TIMESTAMP(0) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(0)
);

-- CreateTable
CREATE TABLE "observations_station" (
    "id" BIGSERIAL NOT NULL,
    "name" VARCHAR(200) NOT NULL,
    "lat" DOUBLE PRECISION,
    "lon" DOUBLE PRECISION,
    "elevation" DOUBLE PRECISION,
    "date_installed" DATE,
    "mo_station_id" VARCHAR(50),
    "sms_system_type" VARCHAR(50),
    "mobile_number" VARCHAR(50),
    "station_type" VARCHAR(50),
    "station_type2" VARCHAR(50),
    "station_url" VARCHAR(255),
    "status" VARCHAR(50),
    "logger_version" VARCHAR(255),
    "priority_level" VARCHAR(255),
    "provider_id" VARCHAR(255),
    "province" VARCHAR(255),
    "region" VARCHAR(255),
    "address" VARCHAR,
    "created_at" TIMESTAMPTZ(0) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(0),
    "deleted_at" TIMESTAMP(6),

    CONSTRAINT "observations_station_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "observations_mo_observation" (
    "id" BIGSERIAL NOT NULL,
    "pres" DOUBLE PRECISION,
    "rr" DOUBLE PRECISION,
    "rh" DOUBLE PRECISION,
    "temp" DOUBLE PRECISION,
    "td" DOUBLE PRECISION,
    "wdir" DOUBLE PRECISION,
    "wspd" DOUBLE PRECISION,
    "wspdx" DOUBLE PRECISION,
    "srad" DOUBLE PRECISION,
    "hi" DOUBLE PRECISION,
    "station_id" BIGINT,
    "timestamp" TIMESTAMPTZ(6),
    "wchill" DOUBLE PRECISION,
    "rain" DOUBLE PRECISION,
    "tx" DOUBLE PRECISION,
    "tn" DOUBLE PRECISION,
    "wrun" DOUBLE PRECISION,
    "thwi" DOUBLE PRECISION,
    "thswi" DOUBLE PRECISION,
    "senergy" DOUBLE PRECISION,
    "sradx" DOUBLE PRECISION,
    "uvi" DOUBLE PRECISION,
    "uvdose" DOUBLE PRECISION,
    "uvx" DOUBLE PRECISION,
    "hdd" DOUBLE PRECISION,
    "cdd" DOUBLE PRECISION,
    "et" DOUBLE PRECISION,
    "qc_level" INTEGER NOT NULL DEFAULT 0,
    "wdirx" DOUBLE PRECISION,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6),

    CONSTRAINT "observations_mo_observation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "observations_mo_observationraw" (
    "id" BIGSERIAL NOT NULL,
    "pres" DOUBLE PRECISION,
    "rr" DOUBLE PRECISION,
    "td" DOUBLE PRECISION,
    "temp" DOUBLE PRECISION,
    "wdir" DOUBLE PRECISION,
    "wspd" DOUBLE PRECISION,
    "wspdx" DOUBLE PRECISION,
    "srad" DOUBLE PRECISION,
    "rh" DOUBLE PRECISION,
    "timestamp" TIMESTAMPTZ(6),
    "station_id" BIGINT,
    "rain" DOUBLE PRECISION,
    "wchill" DOUBLE PRECISION,
    "tx" DOUBLE PRECISION,
    "tn" DOUBLE PRECISION,
    "wrun" DOUBLE PRECISION,
    "hi" DOUBLE PRECISION,
    "thwi" DOUBLE PRECISION,
    "thswi" DOUBLE PRECISION,
    "senergy" DOUBLE PRECISION,
    "sradx" DOUBLE PRECISION,
    "uvi" DOUBLE PRECISION,
    "uvdose" DOUBLE PRECISION,
    "uvx" DOUBLE PRECISION,
    "heatdd" DOUBLE PRECISION,
    "cooldd" DOUBLE PRECISION,
    "evap" DOUBLE PRECISION,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6),

    CONSTRAINT "observations_mo_observationraw_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "observations_observation" (
    "id" BIGSERIAL NOT NULL,
    "pres" DOUBLE PRECISION,
    "rr" DOUBLE PRECISION,
    "rh" DOUBLE PRECISION,
    "temp" DOUBLE PRECISION,
    "td" DOUBLE PRECISION,
    "wdir" DOUBLE PRECISION,
    "wspd" DOUBLE PRECISION,
    "wspdx" DOUBLE PRECISION,
    "srad" DOUBLE PRECISION,
    "mslp" DOUBLE PRECISION,
    "hi" DOUBLE PRECISION,
    "station_id" BIGINT,
    "timestamp" TIMESTAMPTZ(6),
    "wchill" DOUBLE PRECISION,
    "qc_level" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "observations_observation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "observations_observationraw" (
    "id" BIGSERIAL NOT NULL,
    "pres" DOUBLE PRECISION,
    "rr" DOUBLE PRECISION,
    "td" DOUBLE PRECISION,
    "temp" DOUBLE PRECISION,
    "wdir" DOUBLE PRECISION,
    "wspd" DOUBLE PRECISION,
    "wspdx" DOUBLE PRECISION,
    "srad" DOUBLE PRECISION,
    "rh" DOUBLE PRECISION,
    "timestamp" TIMESTAMPTZ(6),
    "station_id" BIGINT,
    "wchill" DOUBLE PRECISION,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "observations_observationraw_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "observations_stationhealth" (
    "id" BIGSERIAL NOT NULL,
    "vb1" DOUBLE PRECISION,
    "vb2" DOUBLE PRECISION,
    "curr" DOUBLE PRECISION,
    "bp1" DOUBLE PRECISION,
    "bp2" DOUBLE PRECISION,
    "cm" VARCHAR(255),
    "ss" INTEGER,
    "temp_arq" DOUBLE PRECISION,
    "rh_arq" DOUBLE PRECISION,
    "fpm" VARCHAR(255),
    "error_msg" TEXT,
    "message" TEXT,
    "data_count" INTEGER,
    "data_status" VARCHAR(255),
    "timestamp" TIMESTAMPTZ(6),
    "station_id" BIGINT,
    "minutes_difference" INTEGER,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "observations_stationhealth_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "observations_derivedhourly" (
    "id" BIGSERIAL NOT NULL,
    "pres" DOUBLE PRECISION,
    "rr" DOUBLE PRECISION,
    "rh" DOUBLE PRECISION,
    "temp" DOUBLE PRECISION,
    "td" DOUBLE PRECISION,
    "wspd" DOUBLE PRECISION,
    "wdir" DOUBLE PRECISION,
    "srad" DOUBLE PRECISION,
    "hi" DOUBLE PRECISION,
    "uvi" DOUBLE PRECISION,
    "timestamp" TIMESTAMPTZ(0) NOT NULL,
    "station_id" BIGINT NOT NULL,
    "created_at" TIMESTAMPTZ(0) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(0),

    CONSTRAINT "observations_derivedhourly_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sim_card" (
    "id" BIGSERIAL NOT NULL,
    "mobile_number" VARCHAR(50),
    "created_at" TIMESTAMP(0) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(0),

    CONSTRAINT "glabs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "glabs_load" (
    "id" BIGSERIAL NOT NULL,
    "status" VARCHAR(255),
    "promo" VARCHAR(255),
    "transaction_id" INTEGER,
    "sim_id" BIGINT NOT NULL,
    "created_at" TIMESTAMP(0) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(0),

    CONSTRAINT "glabs_load_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "access_tokens" (
    "id" BIGSERIAL NOT NULL,
    "access_token" VARCHAR(255) NOT NULL,
    "type" VARCHAR(50) NOT NULL,
    "sim_id" BIGINT NOT NULL,
    "created_at" TIMESTAMP(0) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(0),

    CONSTRAINT "access_tokens_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "failed_jobs" (
    "id" BIGSERIAL NOT NULL,
    "uuid" VARCHAR(255) NOT NULL,
    "connection" TEXT NOT NULL,
    "queue" TEXT NOT NULL,
    "payload" TEXT NOT NULL,
    "exception" TEXT NOT NULL,
    "failed_at" TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "failed_jobs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "oauth_access_tokens" (
    "id" VARCHAR(100) NOT NULL,
    "user_id" BIGINT,
    "client_id" BIGINT NOT NULL,
    "name" VARCHAR(255),
    "scopes" TEXT,
    "revoked" BOOLEAN NOT NULL,
    "created_at" TIMESTAMP(0) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(0),
    "expires_at" TIMESTAMP(0),

    CONSTRAINT "oauth_access_tokens_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "oauth_auth_codes" (
    "id" VARCHAR(100) NOT NULL,
    "user_id" BIGINT NOT NULL,
    "client_id" BIGINT NOT NULL,
    "scopes" TEXT,
    "revoked" BOOLEAN NOT NULL,
    "expires_at" TIMESTAMP(0),

    CONSTRAINT "oauth_auth_codes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "oauth_clients" (
    "id" BIGSERIAL NOT NULL,
    "user_id" BIGINT,
    "name" VARCHAR(255) NOT NULL,
    "secret" VARCHAR(100),
    "provider" VARCHAR(255),
    "redirect" TEXT NOT NULL,
    "personal_access_client" BOOLEAN NOT NULL,
    "password_client" BOOLEAN NOT NULL,
    "revoked" BOOLEAN NOT NULL,
    "created_at" TIMESTAMP(0) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(0),

    CONSTRAINT "oauth_clients_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "oauth_personal_access_clients" (
    "id" BIGSERIAL NOT NULL,
    "client_id" BIGINT NOT NULL,
    "created_at" TIMESTAMP(0) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(0),

    CONSTRAINT "oauth_personal_access_clients_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "oauth_refresh_tokens" (
    "id" VARCHAR(100) NOT NULL,
    "access_token_id" VARCHAR(100) NOT NULL,
    "revoked" BOOLEAN NOT NULL,
    "expires_at" TIMESTAMP(0),

    CONSTRAINT "oauth_refresh_tokens_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "personal_access_tokens" (
    "id" BIGSERIAL NOT NULL,
    "tokenable_type" VARCHAR(255) NOT NULL,
    "tokenable_id" BIGINT NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "token" VARCHAR(64) NOT NULL,
    "abilities" TEXT,
    "last_used_at" TIMESTAMP(0),
    "created_at" TIMESTAMP(0) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(0),

    CONSTRAINT "personal_access_tokens_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "migrations" (
    "id" SERIAL NOT NULL,
    "migration" VARCHAR(255) NOT NULL,
    "batch" INTEGER NOT NULL,

    CONSTRAINT "migrations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "password_resets" (
    "email" VARCHAR(255) NOT NULL,
    "token" VARCHAR(255) NOT NULL,
    "created_at" TIMESTAMP(0) DEFAULT CURRENT_TIMESTAMP
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_unique" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "roles_name_unique" ON "roles"("name");

-- CreateIndex
CREATE UNIQUE INDEX "role_user_user_id_role_id_unique" ON "role_user"("user_id", "role_id");

-- CreateIndex
CREATE UNIQUE INDEX "observations_station_mobile_number_key" ON "observations_station"("mobile_number");

-- CreateIndex
CREATE INDEX "observations_mo_observation_idx_station_id_timestamp" ON "observations_mo_observation"("station_id", "timestamp" DESC);

-- CreateIndex
CREATE UNIQUE INDEX "observations_mo_observation_station_id_timestamp_key" ON "observations_mo_observation"("station_id", "timestamp");

-- CreateIndex
CREATE INDEX "observations_mo_observationraw_idx_station_id_timestamp" ON "observations_mo_observationraw"("station_id", "timestamp" DESC);

-- CreateIndex
CREATE UNIQUE INDEX "observations_mo_observationraw_station_id_timestamp_key" ON "observations_mo_observationraw"("station_id", "timestamp");

-- CreateIndex
CREATE INDEX "observations_observation_idx_station_id_timestamp" ON "observations_observation"("station_id", "timestamp" DESC);

-- CreateIndex
CREATE UNIQUE INDEX "observations_observation_station_id_timestamp_key" ON "observations_observation"("station_id", "timestamp");

-- CreateIndex
CREATE INDEX "observations_observationraw_idx_station_id_timestamp" ON "observations_observationraw"("station_id", "timestamp" DESC);

-- CreateIndex
CREATE UNIQUE INDEX "observations_observationraw_station_id_timestamp_key" ON "observations_observationraw"("station_id", "timestamp");

-- CreateIndex
CREATE INDEX "observations_stationhealth_idx_station_id_timestamp" ON "observations_stationhealth"("station_id", "timestamp" DESC);

-- CreateIndex
CREATE INDEX "observations_derivedhourly_idx_station_id_timestamp" ON "observations_derivedhourly"("station_id", "timestamp" DESC);

-- CreateIndex
CREATE UNIQUE INDEX "observations_derivedhourly_station_id_timestamp_unique" ON "observations_derivedhourly"("station_id", "timestamp");

-- CreateIndex
CREATE UNIQUE INDEX "glabs_mobile_number_unique" ON "sim_card"("mobile_number");

-- CreateIndex
CREATE UNIQUE INDEX "access_tokens_access_token_unique" ON "access_tokens"("access_token");

-- CreateIndex
CREATE UNIQUE INDEX "failed_jobs_uuid_unique" ON "failed_jobs"("uuid");

-- CreateIndex
CREATE INDEX "oauth_access_tokens_user_id_index" ON "oauth_access_tokens"("user_id");

-- CreateIndex
CREATE INDEX "oauth_auth_codes_user_id_index" ON "oauth_auth_codes"("user_id");

-- CreateIndex
CREATE INDEX "oauth_clients_user_id_index" ON "oauth_clients"("user_id");

-- CreateIndex
CREATE INDEX "oauth_refresh_tokens_access_token_id_index" ON "oauth_refresh_tokens"("access_token_id");

-- CreateIndex
CREATE UNIQUE INDEX "personal_access_tokens_token_unique" ON "personal_access_tokens"("token");

-- CreateIndex
CREATE INDEX "personal_access_tokens_tokenable_type_tokenable_id_index" ON "personal_access_tokens"("tokenable_type", "tokenable_id");

-- CreateIndex
CREATE INDEX "password_resets_email_index" ON "password_resets"("email");

-- AddForeignKey
ALTER TABLE "role_user" ADD CONSTRAINT "role_user_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "roles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "role_user" ADD CONSTRAINT "role_user_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "observations_mo_observation" ADD CONSTRAINT "observations_mo_observation_station_id_fkey" FOREIGN KEY ("station_id") REFERENCES "observations_station"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "observations_mo_observationraw" ADD CONSTRAINT "observations_mo_observationraw_station_id_fkey" FOREIGN KEY ("station_id") REFERENCES "observations_station"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "observations_observation" ADD CONSTRAINT "observations_observation_station_id_fkey" FOREIGN KEY ("station_id") REFERENCES "observations_station"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "observations_observationraw" ADD CONSTRAINT "observations_observationraw_station_id_fkey" FOREIGN KEY ("station_id") REFERENCES "observations_station"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "observations_stationhealth" ADD CONSTRAINT "observations_stationhealth_station_id_fkey" FOREIGN KEY ("station_id") REFERENCES "observations_station"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "observations_derivedhourly" ADD CONSTRAINT "observations_derivedhourly_station_id_fkey" FOREIGN KEY ("station_id") REFERENCES "observations_station"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "glabs_load" ADD CONSTRAINT "glabs_load_sim_id_fkey" FOREIGN KEY ("sim_id") REFERENCES "sim_card"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "access_tokens" ADD CONSTRAINT "access_tokens_sim_id_fkey" FOREIGN KEY ("sim_id") REFERENCES "sim_card"("id") ON DELETE CASCADE ON UPDATE CASCADE;

