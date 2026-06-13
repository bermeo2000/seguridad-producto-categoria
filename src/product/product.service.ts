import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { QueryProductDto } from './dto/query-product.dto';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
  ) {}

  async create(createProductDto: CreateProductDto): Promise<Product> {
    const { name, description, price, stock, categoryId, imageUrl } = createProductDto;

    // Verificar si el producto ya existe
    const existingProduct = await this.productRepository.findOne({
      where: { name },
    });

    if (existingProduct) {
      throw new BadRequestException(`El producto con nombre "${name}" ya existe`);
    }

    const product = this.productRepository.create({
      name,
      description,
      price,
      stock,
      imageUrl,
      category: { id: categoryId }, // Asignar categoría por ID
    });

    return await this.productRepository.save(product);
  }

  async findAll(query?: QueryProductDto): Promise<Product[]> {
    const queryBuilder = this.productRepository
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.category', 'category');

    // Búsqueda por nombre o descripción
    if (query?.search) {
      queryBuilder.andWhere(
        '(product.name ILIKE :search OR product.description ILIKE :search)',
        { search: `%${query.search}%` },
      );
    }

    // Filtro por categoría
    if (query?.categoryId) {
      queryBuilder.andWhere('product.category.id = :categoryId', {
        categoryId: query.categoryId,
      });
    }

    // Filtro por rango de precios
    if (query?.minPrice !== undefined) {
      queryBuilder.andWhere('product.price >= :minPrice', {
        minPrice: query.minPrice,
      });
    }

    if (query?.maxPrice !== undefined) {
      queryBuilder.andWhere('product.price <= :maxPrice', {
        maxPrice: query.maxPrice,
      });
    }

    // Solo productos activos
    queryBuilder.andWhere('product.isActive = :isActive', { isActive: true });

    // Ordenar por nombre
    queryBuilder.orderBy('product.name', 'ASC');

    return await queryBuilder.getMany();
  }

  async findOne(id: string): Promise<Product> {
    const product = await this.productRepository.findOne({
      where: { id },
      relations: { category: true },
    });

    if (!product) {
      throw new NotFoundException(`Producto con ID "${id}" no encontrado`);
    }

    return product;
  }

  async update(id: string, updateProductDto: UpdateProductDto): Promise<Product> {
    const product = await this.findOne(id);

    // Verificar si el nuevo nombre ya existe
    if (updateProductDto.name) {
      const existingProduct = await this.productRepository.findOne({
        where: { name: updateProductDto.name },
      });

      if (existingProduct && existingProduct.id !== id) {
        throw new BadRequestException(
          `El producto con nombre "${updateProductDto.name}" ya existe`,
        );
      }
    }

    Object.assign(product, updateProductDto);

    return await this.productRepository.save(product);
  }

  async remove(id: string): Promise<{ message: string }> {
    const product = await this.findOne(id);

    await this.productRepository.remove(product);

    return { message: `Producto "${product.name}" eliminado exitosamente` };
  }
}
