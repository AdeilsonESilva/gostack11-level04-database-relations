import { inject, injectable } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import IProductsRepository from '@modules/products/repositories/IProductsRepository';
import ICustomersRepository from '@modules/customers/repositories/ICustomersRepository';
import Order from '../infra/typeorm/entities/Order';
import IOrdersRepository from '../repositories/IOrdersRepository';

interface IProduct {
  id: string;
  quantity: number;
}

interface IRequest {
  customer_id: string;
  products: IProduct[];
}

@injectable()
class CreateProductService {
  constructor(
    @inject('OrdersRepository')
    private ordersRepository: IOrdersRepository,

    @inject('ProductsRepository')
    private productsRepository: IProductsRepository,

    @inject('CustomersRepository')
    private customersRepository: ICustomersRepository,
  ) {}

  public async execute({ customer_id, products }: IRequest): Promise<Order> {
    const customer = await this.customersRepository.findById(customer_id);

    if (!customer) {
      throw new AppError('Customer not found');
    }

    const productsIds = products.map(product => ({
      id: product.id,
    }));

    const productsData = await this.productsRepository.findAllById(productsIds);

    if (productsData.length === 0) {
      throw new AppError('Product not found');
    }

    const orderProducts = products.map(product => {
      const productData = productsData.find(
        productDataFinded => productDataFinded.id === product.id,
      );

      if (productData && productData?.quantity < product.quantity) {
        throw new AppError('Product insufficient amount');
      }

      return {
        product_id: product.id,
        price: productData?.price || 0,
        quantity: product.quantity,
      };
    });

    const order = await this.ordersRepository.create({
      customer,
      products: orderProducts,
    });

    await this.productsRepository.updateQuantity(products);

    return order;
  }
}

export default CreateProductService;
