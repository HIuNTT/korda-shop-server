export enum PaymentMethodType {
  COD = 'cod',
  VNPAY = 'vnpay',
  MOMO = 'momo',
  ZALOPAY = 'zalopay',
  TRANSER_ONLINE = 'transfer_online',
}

export const VnpayMessage: Record<string, { generic: string; spec: string }> = {
  '00': {
    generic: 'Thanh toán thành công.',
    spec: 'Cảm ơn quý khách đã mua hàng tại Korda Shop',
  },
  '07': {
    generic: 'Trừ tiền thành công.',
    spec: 'Giao dịch bị nghi ngờ (liên quan tới lừa đảo, giao dịch bất thường)',
  },
  '09': {
    generic: 'Thẻ/tài khoản của bạn chưa được đăng ký dịch vụ InternetBanking tại ngân hàng.',
    spec: 'Vui lòng thanh toán lại bằng thẻ/tài khoản khác hoặc chọn phương thức thanh toán khác',
  },
  '10': {
    generic: 'Xác thực thông tin thẻ/tài khoản không đúng quá 3 lần.',
    spec: 'Vui lòng thanh toán lại bằng thẻ/tài khoản khác hoặc chọn phương thức thanh toán khác',
  },
  '11': {
    generic: 'Hết hạn thanh toán.',
    spec: 'Vui lòng thanh toán lại',
  },
  '12': {
    generic: 'Giao dịch bị từ chối vì thẻ/tài khoản của bạn bị khóa.',
    spec: 'Vui lòng thanh toán lại bằng thẻ/tài khoản khác hoặc chọn phương thức thanh toán khác',
  },
  '13': {
    generic: 'Xác thực giao dịch thất bại vì liên quan đến mã OTP.',
    spec: 'Vui lòng thanh toán lại đảm bảo mã OTP chính xác. Bạn có thể dùng thẻ/tài khoản khác hoặc chọn phương thức thanh toán khác',
  },
  '24': {
    generic: 'Thanh toán thất bại vì bạn hủy giao dịch.',
    spec: 'Vui lòng thanh toán lại hoặc chọn phương thức thanh toán khác',
  },
  '51': {
    generic: 'Tài khoản của bạn không đủ tiền để thanh toán.',
    spec: 'Vui lòng thanh toán lại bằng thẻ/tài khoản khác hoặc chọn phương thức thanh toán khác',
  },
  '65': {
    generic:
      'Thanh toán thất bại vì số tiền thanh toán vượt quá hạn mức trong ngày của thẻ/tài khoản.',
    spec: 'Vui lòng thanh toán lại bằng thẻ/tài khoản khác hoặc chọn phương thức thanh toán khác',
  },
  '75': {
    generic: 'Ngân hàng thanh toán đang bảo trì.',
    spec: 'Vui lòng tiếp tục thanh toán lại sau khi ngân hàng kết thúc bảo trì hoặc chọn phương thức thanh toán khác',
  },
  '79': {
    generic: 'Xác nhận mật khẩu thanh toán bị sai vượt quá số lần quy định.',
    spec: 'Vui lòng thanh toán lại hoặc chọn phương thức thanh toán khác',
  },
  '99': {
    generic: 'Thanh toán thất bại vì lỗi nào đó từ phía hệ thống.',
    spec: 'Vui lòng thanh toán lại hoặc chọn phương thức thanh toán khác',
  },
};
