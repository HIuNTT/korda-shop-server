import { Body, Controller, Get, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { CartService } from './cart.service';
import { AuthUser } from '../auth/decorators/auth-user.decorator';
import { CartItemDto } from './dto/cart.dto';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import {
  DeleteCartItemDto,
  ReplaceCartItemDto,
  ToggleCartItemDto,
  UpdateCartDto,
} from './dto/update-cart.dto';
import { CartInfo } from './interfaces/cart.interface';
import { CartItem } from './entities/cart-item.entity';

@ApiTags('Cart - Giỏ hàng')
@ApiBearerAuth()
@Controller('cart')
export class CartController {
  constructor(private cartService: CartService) {}

  @Post()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Thêm sản phẩm vào giỏ hàng' })
  async addToCart(@AuthUser() user: IAuthUser, @Body() dto: CartItemDto): Promise<{ id: string }> {
    return this.cartService.addToCart(user.uid, dto);
  }

  @Get()
  @ApiOperation({ summary: 'Lấy thông tin giỏ hàng cho user' })
  async getCartInfo(@AuthUser() user: IAuthUser) {
    return this.cartService.getCartInfo(user.uid);
  }

  @Post('update')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Cập nhật số lượng của sản phẩm trong giỏ hàng' })
  async updateCartItemQuantity(
    @AuthUser() user: IAuthUser,
    @Body() dto: UpdateCartDto,
  ): Promise<CartInfo> {
    return this.cartService.updateCartItemQuantity(user.uid, dto);
  }

  @Post('delete')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Xóa sản phẩm ra khỏi giỏ hàng' })
  async deleteCartItem(
    @AuthUser() user: IAuthUser,
    @Body() dto: DeleteCartItemDto,
  ): Promise<CartInfo> {
    return this.cartService.deleteCartItem(user.uid, dto);
  }

  @Post('toggle-item')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Chọn hoặc bỏ chọn sản phẩm trong giỏ hàng' })
  async toggleCartItemSelection(
    @AuthUser() user: IAuthUser,
    @Body() dto: ToggleCartItemDto,
  ): Promise<CartInfo> {
    return this.cartService.getCartInfoWithPrices(user.uid, dto);
  }

  @Post('replace-item')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Đổi biến thể cho sản phẩm trong giỏ hàng' })
  async replaceCartItem(
    @AuthUser() user: IAuthUser,
    @Body() dto: ReplaceCartItemDto,
  ): Promise<CartInfo> {
    return this.cartService.replaceCartItem(user.uid, dto);
  }

  @Get('count-item')
  @ApiOperation({ summary: 'Đếm số lượng sản phẩm trong giỏ hàng' })
  async countItem(@AuthUser() user: IAuthUser): Promise<number> {
    return this.cartService.countItem(user.uid);
  }
}
