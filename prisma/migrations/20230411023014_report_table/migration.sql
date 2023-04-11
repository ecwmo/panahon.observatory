-- CreateTable
CREATE TABLE "reports" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "number" INTEGER NOT NULL,
    "show" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(0) NOT NULL,

    CONSTRAINT "reports_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "report_items" (
    "id" SERIAL NOT NULL,
    "file_name" TEXT NOT NULL,
    "report_id" INTEGER NOT NULL,
    "show" BOOLEAN NOT NULL DEFAULT true,
    "order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(0) NOT NULL,

    CONSTRAINT "report_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "report_static_items" (
    "id" SERIAL NOT NULL,
    "file_name" TEXT NOT NULL,
    "created_at" TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(0) NOT NULL,

    CONSTRAINT "report_static_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reports_to_report_static_items" (
    "report_id" INTEGER NOT NULL,
    "report_static_item_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "show" BOOLEAN NOT NULL DEFAULT true,
    "order" INTEGER NOT NULL DEFAULT 0,
    "updated_at" TIMESTAMP(0) NOT NULL,

    CONSTRAINT "reports_to_report_static_items_pkey" PRIMARY KEY ("report_id","report_static_item_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "reports_name_number_key" ON "reports"("name", "number");

-- AddForeignKey
ALTER TABLE "report_items" ADD CONSTRAINT "report_items_report_id_fkey" FOREIGN KEY ("report_id") REFERENCES "reports"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reports_to_report_static_items" ADD CONSTRAINT "reports_to_report_static_items_report_id_fkey" FOREIGN KEY ("report_id") REFERENCES "reports"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reports_to_report_static_items" ADD CONSTRAINT "reports_to_report_static_items_report_static_item_id_fkey" FOREIGN KEY ("report_static_item_id") REFERENCES "report_static_items"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
