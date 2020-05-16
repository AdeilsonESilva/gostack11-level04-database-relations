import {
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';

import Customer from '@modules/customers/infra/typeorm/entities/Customer';
import OrdersProducts from '@modules/orders/infra/typeorm/entities/OrdersProducts';

@Entity('orders')
class Order {
  @PrimaryGeneratedColumn('uuid')
  @JoinColumn({ name: 'order_id' })
  id: string;

  // @OneToMany(() => Customer, customer => customer.id, { eager: true })
  // @ManyToOne(() => Customer, customer => customer.id)
  // @JoinColumn({ name: 'customer_id' })
  @OneToOne(() => Customer)
  @JoinColumn({ name: 'customer_id' })
  customer: Customer;

  @OneToMany(
    type => OrdersProducts,
    ordersProducts => ordersProducts.order_id,
    {
      // eager: true,
      cascade: true,
      // primary: true,
    },
  )
  order_products: OrdersProducts[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}

export default Order;
