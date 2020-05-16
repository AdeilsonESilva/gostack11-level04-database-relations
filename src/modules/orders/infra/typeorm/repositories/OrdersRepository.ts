import { getRepository, Repository } from 'typeorm';

import IOrdersRepository from '@modules/orders/repositories/IOrdersRepository';
import ICreateOrderDTO from '@modules/orders/dtos/ICreateOrderDTO';
import Order from '../entities/Order';

class OrdersRepository implements IOrdersRepository {
  private ormRepository: Repository<Order>;

  constructor() {
    this.ormRepository = getRepository(Order);
  }

  public async create({ customer, products }: ICreateOrderDTO): Promise<Order> {
    // const newOrder: ICreateOrderDTO = {
    //   customer,
    //   products: [
    //     {
    //       product_id: products[0].product_id,
    //       price: products[0].price,
    //       quantity: products[0].quantity,
    //     },
    //   ],
    // };

    // newOrder.push({
    //   product_id: products[0].product_id,
    //   price: products[0].price,
    //   quantity: products[0].quantity,
    //   // order_id: '6dd3600a-fa3b-482c-add3-72d10795e8b4',
    // });
    // console.log('newOrder', newOrder);

    // const order = this.ormRepository.create({
    //   customer: {
    //     id: '4e631580-4c53-4971-80a6-e4c9c41094af',
    //   },
    //   order_products: [
    //     {
    //       order_id: 'ab3da837-e5a1-4edd-bbca-385770a544e0',
    //       product_id: '9dfd4f73-d36c-44dd-9091-7f36fba8e757',
    //       price: 133.33,
    //       quantity: 1,
    //     },
    //   ],
    // });

    const order = this.ormRepository.create({
      customer,
      order_products: products,
    });

    console.log('order', order);

    const aaa = await this.ormRepository.save(order);

    console.log('aaa', aaa);

    return order;
  }

  public async findById(id: string): Promise<Order | undefined> {
    const order = await this.ormRepository.findOne(id);

    return order;
  }
}

export default OrdersRepository;
