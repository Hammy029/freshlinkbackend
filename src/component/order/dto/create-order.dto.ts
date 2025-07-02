import {
  IsString,
  IsNumber,
  IsOptional,
  IsEnum,
  IsArray,
  ValidateNested,
  IsObject,
  IsDateString,
  IsPhoneNumber,
  Min,
  IsNotEmpty,
} from 'class-validator';
import { Type } from 'class-transformer';

// Order Item DTO
export class OrderItemDto {
  @IsString()
  @IsNotEmpty()
  productId: string;

  @IsString()
  @IsNotEmpty()
  title: string;

  @IsNumber()
  @Min(0)
  price: number;

  @IsNumber()
  @Min(1)
  quantity: number;

  @IsNumber()
  @Min(0)
  total: number;

  @IsNumber()
  @Min(0)
  availableQuantity: number;
}

// Customer Info DTO
export class CustomerInfoDto {
  @IsString()
  @IsNotEmpty()
  fullName: string;

  @IsString()
  @IsNotEmpty()
  phoneNumber: string;

  @IsString()
  @IsNotEmpty()
  address: string;
}

// Payment Info DTO
export class PaymentInfoDto {
  @IsEnum(['mpesa', 'cash', 'card', 'bank'])
  method: string;

  @IsOptional()
  @IsString()
  mpesaReceiptNumber?: string;

  @IsOptional()
  @IsObject()
  paymentData?: any;

  @IsOptional()
  @IsString()
  transactionId?: string;

  @IsOptional()
  @IsString()
  checkoutRequestId?: string;
}

// Order Details DTO
export class OrderDetailsDto {
  @IsOptional()
  @IsString()
  orderReference?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  deliveryFee?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  taxAmount?: number;

  @IsNumber()
  @Min(0)
  finalTotal: number;
}

// Create Order DTO (Enhanced Format)
export class CreateOrderDto {
  @IsString()
  @IsNotEmpty()
  userId: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  items: OrderItemDto[];

  @IsNumber()
  @Min(0)
  grandTotal: number;

  @ValidateNested()
  @Type(() => CustomerInfoDto)
  customerInfo: CustomerInfoDto;

  @ValidateNested()
  @Type(() => PaymentInfoDto)
  paymentInfo: PaymentInfoDto;

  @ValidateNested()
  @Type(() => OrderDetailsDto)
  orderDetails: OrderDetailsDto;

  @IsOptional()
  @IsDateString()
  createdAt?: string;
}

// Legacy Order Item DTO (Backward Compatibility)
export class LegacyOrderItemDto {
  @IsString()
  @IsNotEmpty()
  productId: string;

  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  price?: number;

  @IsNumber()
  @Min(1)
  quantity: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  total?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  availableQuantity?: number;
}

// Legacy Create Order DTO
export class CreateLegacyOrderDto {
  @IsString()
  @IsNotEmpty()
  userId: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => LegacyOrderItemDto)
  items: LegacyOrderItemDto[];

  @IsNumber()
  @Min(0)
  grandTotal: number;
}

// Update Order Status DTO
export class UpdateOrderStatusDto {
  @IsEnum([
    'pending',
    'confirmed',
    'preparing',
    'out_for_delivery',
    'delivered',
    'cancelled',
    'payment_failed',
  ])
  status: string;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsOptional()
  @IsDateString()
  estimatedDeliveryDate?: string;

  @IsOptional()
  @IsString()
  trackingNumber?: string;
}

// Update Payment Status DTO
export class UpdatePaymentStatusDto {
  @IsEnum(['pending', 'completed', 'failed', 'cancelled'])
  status: string;

  @IsOptional()
  @IsObject()
  paymentData?: any;

  @IsOptional()
  @IsString()
  mpesaReceiptNumber?: string;

  @IsOptional()
  @IsString()
  transactionId?: string;
}

// Order Search DTO
export class OrderSearchDto {
  @IsOptional()
  @IsString()
  orderReference?: string;

  @IsOptional()
  @IsString()
  phoneNumber?: string;

  @IsOptional()
  @IsEnum([
    'pending',
    'confirmed',
    'preparing',
    'out_for_delivery',
    'delivered',
    'cancelled',
    'payment_failed',
  ])
  status?: string;

  @IsOptional()
  @IsEnum(['pending', 'completed', 'failed', 'cancelled'])
  paymentStatus?: string;

  @IsOptional()
  @IsDateString()
  startDate?: string;

  @IsOptional()
  @IsDateString()
  endDate?: string;

  @IsOptional()
  @IsNumber()
  @Min(1)
  limit?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  offset?: number;
}

// M-Pesa Callback DTO
export class MpesaCallbackDto {
  @IsOptional()
  @IsString()
  orderReference?: string;

  @IsOptional()
  @IsString()
  accountReference?: string;

  @IsOptional()
  @IsNumber()
  ResultCode?: number;

  @IsOptional()
  @IsString()
  resultCode?: string;

  @IsOptional()
  @IsString()
  ResultDesc?: string;

  @IsOptional()
  @IsString()
  MpesaReceiptNumber?: string;

  @IsOptional()
  @IsString()
  TransactionDate?: string;

  @IsOptional()
  @IsNumber()
  Amount?: number;

  @IsOptional()
  @IsString()
  PhoneNumber?: string;

  @IsOptional()
  @IsString()
  CheckoutRequestID?: string;

  @IsOptional()
  @IsObject()
  metadata?: any;

  @IsOptional()
  @IsString()
  status?: string;
}

// Order Statistics Response DTO
export class OrderStatisticsDto {
  @IsNumber()
  totalOrders: number;

  @IsNumber()
  totalRevenue: number;

  @IsArray()
  statusBreakdown: {
    _id: string;
    count: number;
  }[];

  @IsArray()
  paymentMethodBreakdown: {
    _id: string;
    count: number;
  }[];
}

// Order Tracking DTO
export class OrderTrackingDto {
  @IsString()
  orderReference: string;

  @IsString()
  status: string;

  @IsString()
  paymentStatus: string;

  @IsNumber()
  totalAmount: number;

  @IsDateString()
  createdAt: string;

  @IsOptional()
  @IsDateString()
  estimatedDeliveryDate?: string;

  @IsOptional()
  @IsDateString()
  deliveredAt?: string;

  @IsOptional()
  @IsString()
  trackingNumber?: string;

  @IsNumber()
  itemCount: number;

  @ValidateNested()
  @Type(() => CustomerInfoDto)
  customerInfo: {
    fullName: string;
    phoneNumber: string;
  };
}
