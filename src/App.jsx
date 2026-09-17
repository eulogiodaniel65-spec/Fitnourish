import React, { useState, useEffect, useRef } from "react";
import { Users, User, Plus, Trash2, Check, Flame, ChevronRight, ChevronLeft, MessageSquare, Clock, Video, Send, Calculator, Play, Pause, RotateCcw, LogOut, Layers, Copy, Pencil, TrendingUp, CalendarDays, Home } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { supabase, obtenerUsuarioActual, cerrarSesion } from "./lib/supabaseClient";
import * as api from "./lib/api";
import Login from "./Login";

const FONT_IMPORT = `
@import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@500;700&display=swap');
`;

const COLORS = {
  bg: "#0E1013",
  surface: "#1A1D21",
  surface2: "#23272C",
  border: "#31363C",
  text: "#EDEDE7",
  dim: "#8B9096",
  accent: "#5B9BC7",
  accentDim: "#3E7BA3",
  danger: "#E24A3B",
};

const LOGO_ICON = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAKAAAABJCAYAAAC6hC1nAAA2/klEQVR42pV9eZhlVXXvb51z9q2qW3N1dUM1UC2TaTDECC0CBsIggz4xkU8JAYkiojHRIIHok5jE7xEwMUZ4PojAEwMIDk/AKIgCXyM2MtMBBaQRaaQZqumu7qpb3X2r6p579np/nD2svc+pNunvQ3u4de+5e1jDb/3Wb9Hg4OAwABCgAABEYObc/h0DOXbzi4hU+Xq2f6HAnANU82pG/Pe7+wwCFAhgRm5/DwbK17P5bPhnJZiXmP81H+deQ3CvNx+gwMhBUGTet3yNf/7y+co/E5VrVL6H/y7yOcO1gQITyp8HCKSYyudy39m8Jxi5X8tobZijZaPgu9jf29cH/waock91LtfLfjaBwNFa2bW0z2XXJ1x/9yUVMcsd9j/PnBPI7W+8/gSoLP4HApT7M5VPFGxWfKTEgrkHrhw+3s0JNgstD5LfnOoXgziM8qCaz+bw81T4rPb57WrbzzQrS1AAISFqEpECUXRp2B0+Zr/R9pCUi83lRosn9weUc/usBFYMyuXBr6yT+UfzfuWlA7lLQGAFkPtebt0YAEiReT/m8pnk25draYwNRetk11isJBMgD2FobMzl56ohcIcP8eUnBTCyqiXiYMdqf9g+Jpen191ucG4X1h9Y9p8QLHD5bexGyi9vF5rt7QPEolurICySWTB/8+Tr/Hfz35GC72y/RpokTV3o9mKeTxXdHLrcfP8fgCRJoRrZeJZl4wSoQutWYLVYHL7AWpA7YOVmJQCx4vKcKb+W4ugy5QApEClriVnuDVGt1XVrytISm2cR1t7tL4cerXzw8kQRwT5jZNnN8TCX1h3Ecm+UvXjl5XLfXXy2zhmErLzNlJPZ6NhJ2k2uPYTlpngTK8ytt5YUmjvpRsQhiRyMc7elVSsPpF8cNrcvfGvjOpV1deDqxgSXJyFj+MrDPTvb2tTb04sVe674y7HRsdOHR4aP6e3pBTNjx44ds9u3b79pdnb2e63Z2XsXOzuniQi9PT3o6enZH0TQWreZtbNqXLo4u/kVyy/WSclLBABIEsUMcHexpbt5rsE5kCBJEpWkaTPJVFNa1PCN2Vm28ruVJomYS6tnQoLAtcY/J9yt/Aw2N6i0OyacIBYhHBQxO6tOXFp2G9aw/TtzeWhocHBc+nRhevNqfPPfi+EqLjJ2paUJD+IGsvYbLBYFubewwuqJ2x7EQH4xggjAPye7y0JEKkmoqTW3L7jggq2nnnoqJiZWYmRkGH19faByodDpLKLdnseuXTswNTWFZ55+Bo88+ggeeOCB25955pfv0Vqjr7cXfX19q7XWbc267YOmctP9xWITAcg4qdyghKgJIujOQpuIVO+ylR/t33v1pT3jk1C9Tai+QcxvexVTP/vOKkaSa63bcj3jGNJsujwo1kWLmI7LNQTBHp5KbEf+okrrWhsXxmGdiKvDOBogl4TQEnGYiVfqzH31IJoPsT8vzb2IIb0lk8G4iydCq2pcAGoCf38IbRTHweFzr+bo4gSJDYG1zrNMjW/cuPHXI6Mj+O/8arVaePjhR/D97/8H7rjjjnNeeeXl6/ub/c2e3t79u93uNGudy+8iXbOMZcs4LVFaF23OF/OxA9e8unzNu5Y3l68CpQpIUhAzUtVA6+VnsOFb/0ipagyHnorM+8jNLw/l7hIVaQk5CkGDtYoNUxRZxYascihrLkrlALoPomjzZDYpYyqS7tYcLmGCmY2LJfEQ4md8jFHeVJjFsjfTZXzg0joizsLKgx1Y2SiDkwlSGOuWL0zTdHjnzp2bPvCBs/mMM/4Er776KqY2T2Hbtm1YmJ8HM2N0dAz77LMPVu61EgcecABWrXoD+vv7g8O4efNmfOtb38RXv3r1F59//vnPDAz0N7M0Gy+0bjmrEWXLdr2QJIq7nTYjyfc+5vRd4285GZQ0kFDpNLsLO6G7XaSNXmzb8CA23nkNNfr6x+Vax3GyjN8qa84m/yW79hy8zl38yOeVz06KZIhjD6kxLIzwTNQalYoFhPHVoDyEV4RbFt7RHo46SEZarWqMUj1AZFyCidt8UuJcV5hsBIvEUdpPpOwqBlAAuUC5BkqCSpK0Od9ub+oWBYqiqHsNiBJkWYZms29ycp/Ja4448shT3v3ud+O4447DwMCAe+2WLVvwhX/6Aq695lrq5jmGhoYO6+T5S6Xn1WBQYAWSJGkSFyrrG/y9Vf/jL29vrtgPutNG0ujBri2vYHbDAxje7/cxOHkIQAleffAWvP7gLf1p7+C45qIdHByXhZanos7alReTzBqzC4XgIazcQkguGJJZSM2BDlGGpb1j+fkC5rIHsGLGY1NNXGJGwYdwgElV8ael44MwqBWumU3KAUbsurjG0lGUcXq3Rt61RQfY31j7vCWmmKTZMGRgnyQqIVJEaDBzBwxordvdbnd6sbPY6nRyNBoKb3rTmx58//vef+TZZ5+NvffZxxnXxx9/HBdddBF++tOf0vDw8ARrnZd74GEVewizNB0/8PSLf92c+B0UO7dBd9r4zbrvYtuGhylL0Pzdc7+0q3d0bzAleP6Wy16a2/jEwUmjr7mUkXAGQGbFNqAqFyuXGS1E1gEKQnBU4nVjQW1qXI8RcpiU1iaD5gDG5jE+zXVuM9j0+E0Dt2eyLoKCNq8lAXCKgyItYl3cZOJQwL4fIydmZbNZ63plPEPyGSrPR5WEwAXKNnM0lqLcNM7tcyRJ0kzTZJgZ+Xy7vWF+YQErJybee+GFF972l5/4BHp6egAACwuLuOjCv8ZV//ZvNDw8NJFQ0iyKouUw0CRtLu6c3bTXUafxPsd/ELy4C9Tt4JnvXPrFuakXPoNCY2LNyTx54jngosDCzBR+efPn+xOwAiUiafQWJsQWxVmylo8lVmmuO0frI+IYaxCc9yIocplN6KeXzhPCONyeuSSylWGGQgaULqGS8gt5DChnYZZLGIeVDBaM5SwXycUV5N0smwPFDJJ4n914d7DlIWWb3pe3iSgX1q2MZyy2Z76Lc+Pu+3HODrQmB0UTSMnguoSeOOfy4JkNLm+P1kU7z/Opbrc73ehpTIyNja2em2vdddFFF9Hxxx+366GHHjJvk+HKq67Ctddey928O10U3RaIoJnbzMhJF+hfttfpyw89Bd32HNJU4aV1N2Nx+qV/6cmy8eF93vjlibe/D8XCTqRZA6//593gxXabkqyJGIdy2DXnDqZin7YRyCQbpTUjZpHclf8Jj+fjdhLeqFwjWDjMZMzOeErcVhY2JCQhc4jEPqE9JP7kl/gRh9BMualkYwkHOJebCncYwEQuwSgPVOn6KPiScDdLuNByEcvYzR8CYcqZOWcRzLMMkIlR5+4ZyEkg+AZzA5O1buUz+3ViUVlge6FERu0vBWvk3W4+nSk1PrZs2SGPPfrowInveEfjK1/53+jpTZHnOc477zx87brrOrva89N5N59OEmomSTqMooPByYO+0xjeE0nWwLYXn8Srj95DSZI2xw8+auvvnPH3F6jmEHoHx7Ht2Ycw/YufUNY3MM6s2/Z7OTdsjYU9fAR3Gc33QbDmQfJp8FNXEjTvS+RcC1Ns0ygnYsUmXCJ2RlFa35xFMug8oPm3rIrYs4A+SnQ7qAxRkGoqH6tVni4PMlQS0bw8dORcYQ44tyC+AIGI/QVg88WXsNgiJvXwvYN4GESJPdAAtIIB4cvvx4jjRwvmgkqMTMZQzmKaz9GFbuui0x4YHNofzPjUpz5Fzz//a77iiiuwMN/BGWecgfn5BT7vIx+hvuHecSSJKjp6ujG8AtxdBCUp2ltexIrf/QMe//13YPgNvwdijTTrwczGJ7Bp7ddXpUoNe3dJIkNihRKOUjYA5GAvSlyPDYhcXnZSft0YMhm1HtGW8YjJrJsvD5Ygs3sKE1rZZ+G4lpr76o7PETK4ep1dXFuiccfUlqqUiDRzWzuVRAF3ENgZdJcBleh36O4JfkFgs0IWpR7rBrzlgqu1BniXqYzYm04UJCcGbijjmqC86C021QDX8vCxS7jYEQcquLz5fVEUrYSoOTa27JArr7ySNm+e4htv/AYW5hdwzjkfQqvV4osuupBGR8eOmM+7T6HRBENDdzrY89B3IW30QWs2oS5h8xN34eWf3LicdTenVDVZl9bPYbSgcmNtWEPsYSdXr2bz7FSpibOraJCA3rwRYZMbhzF5uVGuakdk7qE4RxXCShQPMnwtuJ69EmUuJhMGcYByi1gjSmZ4yazXo+mcg2WMICxyVNw2yLyyfw/2oYBLPMhbbpn9mbw6j+MTd89cTO2xJvLZCeAvqbQQvtAfBdqF1q2i02mNjY2uvuWWW6mhevimm29Cp9PBpz51Pp7b8Cxffc011DRRUNboA4OQNXrBAPT8Tsz+5ilMPf6jdTs2PfWHqqdvnJJMQevo8JD4TjbZMkQEYTTIZ7qybFoeFeetTHJHBBfPe++oSk9E7nPKun+5TwxJWuE8AKKZI2CafDIzODgwHASx1mJJqlOAtxl3GVOYUIVEAmwwKKFFGKP0yqGL9vXMJdL9sJrgF3h3BfrwZ30mjNpqAHkcjBGVDc2m2kzaVmSIBY2J0NPTc8DW6a0Pf+5zf8eXXPK/sLiQo1ss4uijj37oySeePOoNR5zCKw59Jzpz08h3tbC4/RXsePnZf9/1+osX6EK300bfOMC5s0SVkInCkqRc3wiRAMm8liuQjUQ2IiKQwHBJkUUZRCnVeylnBGrJEbKCQkNDg+MByyRmPBhQMwCYa9Dx+CAFoLOIBesOTsXyuZjM8xPlZyNy+9VasyMjRFgXQvYNR1iijDMlpCPfO8rogsicJFPFfxYRqSzNxmdmZ5+6+aab+Yw/PQPMwGOPPoJ3nHjS8obKJrQu2t28M13kiy0iUmnWGKas4WJxDmJUueYRq6im2hJcRFF/Dvh/AuuT1Y3wLMgQbOm6r8QOY3gnfq7EZ5Kh5fBZqsfo7OaQvBER9clmXiG1qkIytVigSGED6lIALLlYk92/qLgmaeEAU7bz3EZZG5YxkePxyewaOYlUn+BYLfagKhki2QVhh5dxdPjIIQRFUbR6Gg188pOfWLNx40YURReHv+1tuPCvL9g625p9Ks2yEUqVyvoGJ9LegXGkClpzDm3iYraVnYo1stCkYlSxOAulhbeE4kNpCRFxCUO59yUJ6QiIBcIwCJ6DTOJiQor8c1ItlbHAbqIvYTaNZXodl8gkcG1jDXFIXcmIHUSQyxSfUNJ5zK3PmSTrmFBHMC0zZVOHNJ8l398eOJ+U+INZ/hyZ9yif22biQa1ZZuzu31yMaLGw4EB4107QrNu9fX37T2/btv5zn/s7ZFmGoijwyb/6JFatesPFu3buWl/GtZxD69wD5Jy7M8MRX1OiE+wvU7inFHkqhsB2nXkwbB13Pl2Fij3JmKgKbYEk2ECKKsTfJXjJ5r2S6oMS/Kax3zwOqhK5WSwfeJJkJIu0m0KCgMuUDNkxIArEBFOL2stMVMYolilM3iy4hIAkQC5AboSXxmJ8tsoRwogeoEYcirg2BHJ0o/J1njThQdPylUU3b42MjEzedtuttHbtWqRpirGxZfjzP//4pfMLC0iSpFmljZVZqLzsAQE3qq1X/t3sYeUQCC8Uci0BSWQV64XgPKCOre6wAuX3z/1bzhJeM++R+ACSA9NYvjBRjqJP9f0gFsDm3XAAneF31PISNnCW0VmnGEt02RNcNSIo+bAsPRkrwDIfdZT5iN7lLDaT2BCP9nuWioGD7HuX2BkhpKwbuMmZAg59EXk0voyLNC677FLkeY6iy/jQhz6Ifffd92/yPJ/yGbW4uCzJqiQOmluTsPoQXeQADglZTY5Y6oBqiQiYMKJcC51X3LNAGly1jF2hIowvDdBdIYHIWKJK9GQJh9Tywqqb5i2fWzBRLak7pG5xRfnHuU9THREpvvw5BGU45+apgluVCxkFwSWY7LiZIcOSo/cmQeOS+CRbHLL0AHZzE1IewikxOGbkRdFtDfQPrL7vvp/SXXfdjTQjLF++HGedddYXd+7a1U7TdFj2uMTcOxtDE9jVaynK7F18G/fVmEvsql7WqoFdPGwrGiziOGv1YwqcWw+uNArldcQRrklSKzFgJV2GjH08e1YeVkfl8slK+WUIrt4oYRlRbcltwiAbaoiqFC73BGRJAuEmheRKDiAVG4+5+NCGDARRFXGldx86kKgokMgOHcGBUKnEWPIC29iNBMRFxmWWn/G1r/1fu8n4o/e8B729PcjzfMrGYcK7uNjPHxTKKZFEBN9oVHomVnGyUEuHC0i+rCSm6ON/dqB99WKQOxPWU7ozYWNYi0NGTo4ZeeKbRvxfsmCB2MJ/WP6harNLlFkJHC/mhcFz9rxbDtwly7CARVBLztXa/yoNTeYzw9qx21HhgjhsnZSHk01rAIueOV9aNAvJpq5Nyh9wWw0wFQJTuiqtiCd9FkXR6h/oH7/vJ/etfObpZ0BEePPvvxlr1qzhzuJiK0nSpiVRyLqrhHVgsT+wcW2GXEq+/6ISF8buXduDa0qd5ABiwROUOEZ0VSWwzG7fHILCPnlUEJR+QWowLrgGtHTBa0yNEhUOme1I9yq72bja41puhl3c3dC5y5tMAYuFOH7OOvoPmYqFZd6wAYc5t2wQ5gQkwWuiCMdkZ2mDg+5jMghSSO6qDBT+rMwOBUyYqywbb821pu6+556ykKoaOP6449HJ87IvBABRoiQKYas/pSv1mbhPqHyy6EIkuxeGNOAtHAeJJ0Vtt+X31gKqYtRVfKp4IOc2di5D3ySmYQUAaxJTseoyUiyFM0XWLypqBwwUmbkiuNlV1nSMSQZYnWB/VOJIRxdjAIZGJXtKxE0kz4SDY8Y4N04O0WdXDwVIx0TWMBX035/cwSQRush9Y0aepQkeevBB9xaHHnYomBklhd+HKu6QQxy2KKZ1LGuEiIWDz5hyGQqZ3Vf2Z4SXUT7TpYioXNfp6LsRXQZs31ME9MJCKlFGFQewhmzqN5YcEIywsz42yY7qFPcmBM1FIlaKAOtKI3mFmBpjW4ggBkk9t3R/uXDsIGMQOMBlScRv7KxlEHy7rFzEkf731m3H5Sm2/EYfdmit241GD37xi59fuX37DADgoIMOxujIyP5aF21RNw8Av6CnhasiARLjA4UZcMVLSPKHf5e80mYRLTACOpeFcLQ74J6U4hM2h6ZYRMJYqMT+Q6WNTmZRzOLLcC213ikN2ODbYmeCrCDqjXm1P4MC0mOMYPowgaLM2X4xzgNKvgC7QR5T9FmtoIRJDiTVcAgZeRjPkvg5URYx8YElf7peZaqpMIBVkqbNTS+//MmXX34ZALBy5UpMrlp1TbdbmCYmXrJdFnVCAZUSnbDg8Xpbq2YPDJtYtZLQ6jzsSBT+g1hVqGHwyRtMzGspe0GYZr5LEmRxEF1s0bX3G0CRWgLXZlqwLgdRxaMWrQ9/PrZ6QdxiyaEG2Kw0wFNwJKzJD6GfsB20XCATuzhOgrnZFfyTRABu8UFLw2EyZFlPThCWHALozTWjrVQ20c1zTE1NAQB6enowOjJyQp7nIEqU7RcWkFTlMJpMVFkGub88iSSH5HF1yx9ujzoTQSVU0+gueJbSqkexsbIhiGtCZ8rjgyfqrh6Ijt1dEIMxo65tUxs6Th2JLoiluGot41quT9mrpSZbgvO9GTbgJw8As4eD2FZOnP4IWVo+6vpauaZcZDNg5ghyiCx56KLZMVN8OOMVHcjAQEw+6UuTdAQEzM21TCKi0OxvotvtWkgndJ2O5iRpZSbejcIW8tIpLsMN3e3SUimoXtg84gcop4ohOKAutEzKJEpCNUEPjtk3AlRClQWUB8UGqPJQSZoShTABQlhElscqmaQ73BzUlcuYg2MKUFW3B6GYj79AhLDNNARRg4MsoCJXGXF1XnbtA1HhP6+QNQJIwlZLwqqItMbWUmjWu7rdAouLi+579Bo1htICCs5jAIZ7Pp3jA8ZNZOawS45e3NttqzoSFrElRhmz1TKWXPZMKmTPkKigxD/Pldg9QS2sQRKKCLNWAdnYUywPQ6XuSGEFxBEhzQ2vWCSTOQb/7m41qWrGLFW9yNaHHc3KbqLLxs1GuOZsh3VZto1xe7YPJah3MypdgZalE2STshRn8D8ihcRYQwOvFEXR4oi6niYpVFbyhDVzu46EYN2tT+jY4bUyWSLh7kiQiGUpT6qJVXo5xD7H0FSMSAhKXlCDLr2kqNOTbRsoL20WwiCSAkV2UxQHGBFVZDzqUvNA2w4UxoxBAidKgFayzLl7VlV9mrpGZyGRZjvvxIcEWnwRgG0zx5K14zrunGWRz8NRpSjmB1oygbOCroOOcgooSuw+L0kSTEzsCQDodDrY8vrrSNIk6FDzFQcL2DvmsvJ9Kj4edH01bBvByvaDqlwGOY5h/PeQrZzwNXBeIvnxLGmPp9rnjvfPh1GOkk+VmCuEN8xplmUmiW/VYUNSZk0wNIKapVRXYBHgM0VaJhYuSMShoYrYoVfa4oiwyvY7BQxsR1tnoStTw9oN6GS+GqhKGCFpUpIoMKPQRSvPu9NFtwutNZgZSZqi0WioRqMxqXXRdvBOkihiqGXLxo7Yd999nc7MS5s2XUCUoCh0C6L9wStNiUSKWDbbu8aqqqYfwapUOQZPIN9BYRIqvp+9hPXlO4YktnqYK+wximE5eU6yoClcJj4soA0RCHvFTUm5hyvpyLjQ+oLyvaxr10Ft1H2hxDTWCFFFGzyXmntcUQoNgdjqF/Rxa1IJIn37opWhYAfqsRC/ixVTwciTNB1OkqTZ7Xan53bMbdKakSYplq8YP3liYuIflo2NHZmkKRbm5zEz27p969YtV23e/PpdfX19aDQaE2UJjNEtutP77LHPlXus2ANaa7ywcSOmpqau6Gk0xrXW7XKDE8W+K1DAZCTXoDQSpn3BuGIVepYaCb0KlctXckzS4kqiJmTx/dwU4avgsLBAsXAmIzwbkBYwqkIE+BbVwBDi1ZpyRwsHVThy1vT7g02q2kVPS7hycn0gTrCSUSEA1N2uWOXTaKW4TfIiFbZDwtSkmRUknZzJiXCmaTpMRGrnzp0v5HmOFSuWH/32o45a94fHHYvDDj0M++67H8aXLcPA4ADSNEFRaMzPz586vW361Ad/9gA+e/HFH9u+bdtNaZoOWzmOqdc2f37DcxtOW7NmDX50551YXFxEX19vU1hAoeBgCZ+lG5c0OB9XUZi1A1U116U3NHS/gtUUkBFctUx6xAjjDmJ+e4HDpBRgI80RNetII1ur/xfEhEvUBSMVKopbOCXjlqqyDZUbb1wpu0bp3YC0/wX5kDgMqErSGZdrLGSWpuM7du58odstcOTb3jZz1gc+MHLiSSfjjW88EP/VX+965ztx3333Uf/AwGG6KHaBgMXFzgv77L33lQe/6eCPrlt3/5rOYuclSiggvIrutYAf6HJw0ygmOwh3K5kWSOWFQlLVNQ/1IZ1EcE1IJa1dnCss2XFZdsURdl9k5uiNpPAPKSSR4pGIq1zsSFG9NWgB8HR6C3ZXDz4HLJw6kaTw/apSY4SqKJG7pVSjbM3I0zQdZq3z1tzc1CGHHPKDT3/606e+//3vd9ov9teWLVvwq1/9Cr/85S/x2tRr6CyWwkXNZhOTk5N45pln8MUvfpG6Jj5ETZ/+yOjI/lpzW8jvglm3l7Lysv0h1tNZen2WaLmNEkcvtUZVPUBUheyXOsj1mjCROlagEhWYTOxmw0PfH9yMisBRFLSGhFYkNZp9saLBb+tbrlNBrRPDCRjDguVR1bRjKKUm5tvzGxqNxsSnP/OZ184///xAE/DFF3+DO3/4Q9x19114bsOGyze//vplc3Nz0/Hz7bnnHifvueeeF++7737HNJtNqEYDKkvR7RaYa7WwY+dOvPbaq7e99JuXPpwpNa6Lom2zympLq5BNI44JPHm1CRxLh1M1CENoKDgMjyj8rDgJqXTHIVRUDS+I8TzeBVeDxN2bUM/68LhQwBlUAFcFLVFlVcsu/1qZD1HAJyfYLQSOiAOqEyQm5pqWeGnlJtHjbDc8y7Lx2dbsCwcecOCXv3bd1y44+uhj3Mufe+45XHHF5bjt1tuO2bJ16/327xuNBg484IBvv/Xww//k8MMPx+qDDsKqyUmMjY5hYGgQWZoueYlmZ2dx1llnYu3atdTsa+7fLYpph51FbZ5hVQEVxVeva+PhICcNJ3FPZ7XI1W2D8AjVURl1bbZ14xeW8l7Be8okpM587w7zcYeWKHeN7JpE45qPSRiRyLlvUPJSvqCoh4BViG+JKo2ARwzbttL0ztXnVqGUWSXgdhuoVDaxffvMhmOPPY6/+c2bMTExAWZgsbOAL/3Ll3DllVeeMDOz/d6GUs0EwPiKFUefdNJJ604//XS8/e1vx9jY2H85LgQD8/OLGBkZwRFHHIk77/wRmn39ApiXox0cLQpeRNJld6LtwUfwfs6I0NuWCvqWlsFOUUzFl9Kub4BORWB8LKtXTUBqpJ/ZwTDInWiPdEsBs5YDCjZr5EG0W6IdvzW4rVZL2AiBe9glVqZiorxu1EjYjW+JCjW3ztGjKKiDSq6dPXw9jcYBMzPb17/3j/+Yb7r5m2g0eqE18NyGZ3HeRz/SeeCBB3tGR0f2T4iwbHz8nAsv+tCVf/bBD2E/g+XZX1prvPb6NH7z2hZsfGUKm17djC3bZrB9Zha7du5ElhDShHD+uWfj8DcfBGbGa6+9BiJCklCz0NRy/S/SRca1ebtPJCcDEGKZ49pkUAiUg6ECNjo5wxhZOTeCwZlKMQkgEsTkuMMuqHgFMEwYN/h6noQiApICESQ+VIkRyzglr81m5f8Lt28p+zG7RUqIxeFBUBmIIZwgkOYoPgw3lYE8y9LxmZmZ9ccfdzx/69vfRpZlSFPC/fffj9NOO23NzMzM+sGBgeGZmdkXzjrzTL70ssuwatWq4OA99auNuOMnD+Oen/4Mz23chO27FrDYycGFBoE7CYoWad0mcJ4vLv76Ex8+85Q0S8DMeOGFF9BQChYDNL3KkfC412e2Gw9J3SLPjK7PRkkkAr6PpOKxbJ+VPYSyTYK5ZNtQODin8v+un5ydKhYid53t1js4UUZ/QDQMy5e9nnBVjjUoDcEuZoXJXCPjYWZIKN+JlYTNTjVULtmaaZ414C46TRvEfQlOTw8JUXPnjp0vrJqcvPiGG25EQinSNMXatWtx+umnH6S1bvf19TWHhodP/tp1133n9NNPR6E9se1H6x7C1d/6PtY9/nPMzrRmM9Lt3p7Gyj7VQH+zxz5LA0TL0zTDQrfAW/ZbdcCaQ1abhOZF/PzJJ4/JlFKFLlpiIhNsB1wks1uW9Fhm+hSRIxKPLgitxWpPL7v+4iCcEVS26igMVlKYvBbeMopdEh8OS7iMrFISWyrZgNDlc0UOrpBJJRTiYjkSrGChXmCrEZXZdMyIs1RXovYLquI6JIy8hBDcsQmjjYNURIp0rA2AkKkM133965dOrJyALhgPP/wwTjvttOVaF+2iKNoHHHDgD2695ZZTD3zjG5HnOZRS+M9nfoXPffmruPsnD/yakQ4PDvYvXzY8MKJ1MaKZoVmjKBhgbUp/CShJsGPXPP7wbW9Bb08DAPDII49gy9at94+MDE8WhW6FYxBIxHDsGpPY6TcaxVMrFOnn91UyWVkDD7xdJB7lFG5NMilHuFVhlhosm4XldTGo5xnY85S52CjOdIK2u6UgGAo4On5yEnl1TVGPjdkYjuMmYZGo3RKQ1tCX9qwmoC1DucZwUR1gOeXJNESF48VKl68yNT6zfeapCy+8iI899lh0u13MzGzH2WeffWmnszittcbk5Bv++Y7b7zh1ctUkOotdNHoUvnTdt3HJVTdg11xrdmhw4ACAoFkj7xai/kIOO9MASGvkiwtQ6M6+98SjR+yefO+225AmCRJKmpp028EU0aUMTILt4BN6V16lwfIGrXpELOQUIxiStFrK0JV94excMGQGLuCa8hKzwFqtQTNhWiLyCQpHbdDg0OC46wqtEREM1I4qtd56ixm646paegX8jEYoCAnfcAYIhQr+cWuoD8jDZKhOvd19v4RUp9OZ2mPFHp969LHHLx8bG0Wapjj33HPxjRtvoOHh4cN6e/tW3333PTcddPBBWJjPkescH/3spfj2f/x4/fDIyGFpmqDodsP8R0gP2DkcYCDNMszt2Dl77JFrRn58/RVIE8Jzzz2Hww9/64jW3C7LdFwtNf62qVDY/UDHoCoUvca/r5zLInvvw6kFdZUmWO1AQf6Q6mO8xNyQzHFauL5GGJhqd/jqAGtXzA8OT22JTYKTFDI4QqmOqC+lcnhZFMghGMlGyNJJu7GSGhy+h5iRUNqcn1/Axz72scuXLx8HAPzwzjtx44030rKxseN37Nhx7403fuPxgw4+CHmeo8td/PGffwb33rvux8vGx07pFl10tc+WbNMTkegIg9cOYV0AaTpy0UfPRpaWPWHXX389duzY2RodHd2/282nq5Kt1bjZQl8BAO8FKZUgvlRFQUu5YT9PxDZpubUjMaMvUZKgEkJgsueHogTVi4zC69hImMxQ8i1hIO6/IFZWOWqpgnVVn5bDxqO4wSlSQHBukaI+Bwpk1UwR3Wfa0iLKrjMvrG3BWZ1LSjiJBqbypieq01nctHJi4r1n/9mfgZmxsLCAz//9PzwLAFunp+8955wP8zvf9S4sdjpI0hTnfvafce/PHnttfI89T8kLG3ESmBms2fVnIu4kI0KmFGZnZ9ef/AeH4+Q/WANmxiuvvIwbb7zh1KHBwfFy7pvVYqG4VRYhcYMq0VcgICAJHyIzJQpF3x0D2rZOglynHFHiRIVYluFMqBWjE5U5cEJXKJ6LYl+fgEN5CefauNoJL7IwVdfPW2ftIKS7pOJCTJ2wyvuSteEauqNmeNGIXekVDsV4EhUExJ5xrUp2SzI8P7+AE0886ba99toLRIS1a9di/X+uP7jRUBgfX370//zsxcjzAj2NBv7PTd/D/7v97tnxseGVnc5iGAsn5UhXJyQpmrMJACWEAoThsWWHXfY3f4GiKHWV//Vfv4ypqc13ZCorKVhEkVp/YOEcZcrT8COaO7OXGl7CB7vOQpba38KDULTnTj2C/LwUkoUDFxZVKW8smqJKZVUl3XdSAZOXYDiHzUZc7cmVMvyxvAd8w7adMRty25xoTghcmooGL3G446njgkxrhXh8RxqLgcpBzy7jHSe+A2xc/G233QpKCO32PM4998Pr9t57L4AJG154CZdccS2GBpoj3W7X1b+YtW9xN3OFfYunsZBJApVmaM3MvvT588/Dm1fvjyQl3L/uflx99dU0PDQ00c270+X50LJl1A1yDDaYZS82BTNdXFsos+sjrgp1ch5oxzh5FI9SOFUMoaQV1t45aDiSxI/q/GdpKEJ5t8Q3p1Sbm+sUCBDXCWuxQyHvISQ47KIg6huRYKZrthFxILHXLxFGM+j3FTIVEeuCrYppHrj4JFGadXt0dHT1W9esARFh27ZtePDBh65t9vU1VyxffvRHzj0PzAzVSHDJlV/H9i2vr80Shi40YgUFiBkiLEIDsIZSCtOzOzsfeN97Vp3/wfch73bRzRdx0UUXvpTneahlyFJTxSYSTqXM63STVSGQYuCSWEoIpOlkSy1ZXNRYtWDPqdLQTq7iEajExHLOLgblAAgP40IImZGyL5iqx7s6G1gMIHb12MgNL5HEWJNuO86s2a9kb5GsR7VPOFTR95+rI+Yye0VPK4zDsbZzWe6an1+Y2nvvvS/fa6+9AQDr16/Hpk2bPlZ0u+2TTjpp3X777wciwi+ffxG3330fBocGT+h2u2DW5Yo4awNnCctbncCM0YJKCdObN6899ohDG9f849+gW3Shsgx/+7efw2OPP/aGoaGh/YtCTF2npFaz2sXDpuVSANW1XWfWfQoM1TUmeYUKrozYIhHHuyE+duCNPRule1PeG0qQny39DqHolc4rmhYwGtHV4L4Up7SZZvXHEMwOCyj7YgqjwPTgRIGCIW4IegYA2cjNeXTmouoFnIyvyMEVqpotQTuopCvlnQ4mJydPaTZLitWTTz6BPO8ARHjPH/2R+7Z3rP0ZdrTm1mVZ6lw12TjNWEGX+XHZC0IJoae3F9u2tx466vBDT7jlyn9ElhBUpnD9DTfg8ssvp9GR0dVF0W0lSdIsYz+4co7wHLmoW0dq86JZ3A/wkd4E4RQlQp0kc0CnIzHwJzr8FHkW0YPjrSbZcipVxtKG+txl4pvEFBn/Rd0oO+9SNVcyKi8GhGqph51JN2UeLyjMsd5xZa5ITQAtGbfWdYctikKrJGywr8jKmvhyfPkKJGn5Wb95aRO0ZiwbGzvrsEMPAzNBa427H1wP1Rw4BpS4GI+ZA2FrEslHkiRQWQNbZ3bsetdJJxx5x/VfwWB/HxoNhdtuvRV/8fGP08BA/0Shdcu6bplUWKKvTATd4WHRE2zdLMFpXMvs07dtBqNXnReycmqlW9cRthfoEfoSH/lm95KhLpr5jTdw2TjJ+Xx+7otrmGcgkY3aQc9FjWRGbbUuUuOsNqZ7iQ7JOaticjHZgFQFuQ8aql23f6TexWJOLgUysk7EnnxDdk9PA1praK3Rmp1BURSYnJy8xo5d3fjyFJ585ln09faAkZaTyxPjJrX2dW775bMUncX5Xdtac7s++aE/6f/e1V/AYLM8fN+77Xs488yzyCd1unRr8KKbUrDT4WZuTBj7yaMQMVXdfBS2nEw7diKMvc1MEymPXEk2YjUsEiQvO1nJqI458ixkcz/L+XyeYSO9VxKrIYQwjE//Ax6gyFLrFK2k+I3TZLY4HcIsyGnfkUznKbJ4nrDqkxCWGn1OYDxopPGr5omr5BtjsizF1i1bkCQJkiTB9PQ2AMA+k6v6Gw0FSoANG1/C7Ozc1pQ0mAtzyxK4yqvWZazXaIApwfbp7WvHhgb7v/Gvf9//lb/7K2RpgixLcdM3bsKfnvmnlKlMNRqNCV0Ubc9CZ+HJKGj4F7VtU9o00yqtBAkH6ql+WpS5/MRh8iFwXsgDLrQxXDunVD1lIULpVBciGV7ffkmqBvd1imPyZ7KorihpP4Fv9006knZDiKdYiqg2qAfWzgqTfSW2jmzKclzW7f3IecBN4yQ72suKhhNXBh8ySRFxBK6fCErroj0wMDB59z339J911pm7AML69et/LyFgYmKle9KXp7ag4KSZJCl01yTVSQpKMyQGvV1cXOzMze14YXzFHged9xfvPeGvzz0De+253G3LpZdeiksuuYR6enrGLbPbjzwi1x7KASziByKyjMVtJcMIToqMVZGrLPnSn8jIg8Z627oZhkxCrFM0QZGZv4caXRkm318d1fKjCpmdMRwC1VnA/zekVK+NUqcIYMBKbYiiCBVNvRyH1SzREQeNqhWUYOZaTLj01CrbmA5o2N5UpwzgtTfCSZtmwIs4yK75ncFIkqT5zW9+iwBg2bJlhzADQ0OD7ummp7cjQ9HKsqyfjdstigKdIsdiV3cY1Nhr+bLGeacce9DHP/A+/M5++7if3fDss/ir88/HPffcQ2Njo6u15nZRFK1AcaGm7iskZQQ93sVdMjM2kJVZQ0/GsDQqJV4cSO5xDXHYs6xFgsmW6Mp5OBbNi9O7SgoQDL+OxQPqJjhlnnJj0nvXTyH1YUjVjgitJ2/lEo9iRp4QmrGsR3Agy2K3Ch+cg2SnHBcKc0MTw77w8wQQyG+Qw60QEB1cJmYhgzaB1NjY6OpymlG3xQAK0bU23+mgO73t37dwcRozQGk23qeS5srl4/2HveXNjXefcDROOPJQrFyxzP1Muz2Pq6/+Kr7whS+smZ6eXj86OrJ/t+t7PAJ8VcxkljUNWe1hScvy0mYqaFd168vKi4UC0NpYNOm52PeGOGzRE1mDGr+Ye+fnxXAQ53t97eCcVIyJfGZrPbOIQWLKSZwH86h4NwpJNb0BnobvbrnB5ViVVH6KRkNwLVPZ1xbtmFT2gbIbkRCzP7wYuJ966QFd1wVRbqhicN7N82kG5UplEwSgm+fQWqObF3jvycdiaHDwb1VKyNIUe65Yjn33nsB++0xgfGwkWJa5uTl897vfxVVXXfXQE088cdTg4MDw6OjI/kW3aLFQFYv5jUH7ghzuKNluBseTE0SDtkxErQwCzLZhjmQ0Ce+yBI4r3LW7HD7cCQoXVg9GHjjneiVxVcxgNplyVpkNGwsXypm/TufF/t4OSvFQiBhn5pkPFgQF5RL1r4gNsRxm4zViSvlX3w0XDFQu37AyINnGQk493vwll+Uf+z5uxq497GmW4emnn0aSJGj0JHjrIavxVsNarvu1sNjBk08+iR/ecTt+8IPv//jpp595p8oyjI2OrS6Kbqvb1S0SjeOlqCWJ6Ni7VxCrcCSsWANTsXBjKKwiLfl4OOjhsE1dkY5fILa0RK+xmyggcwKOLjNH9f9o0CSEJmMFKHecTQINDQ6MB+qiu21dZEjNj6DZpDKiVbtqhGZuByB11BvqYROvR72UgkG1p5UCNyCzMzlaVvR/ifFZXhnL/llrbjOAf/6nf9p16qnvRn//AJRqQKlyttvcjh2Yeu01PLthAx5/7DE8+sjDsz//xS9G2+159PX2otnfPMTGeu5QiBSVSdbdRWulezrB4CHfSxGvM0Xi6yQ63vzr2ExKB+paK0l2bHOoIGZ7pSmqtlTl8cKW1yrXU3rykM8IAmhoaGjc8cGw9AGs9PY6jWE2cQwv2RcaMJpritq/neS6dDO6H7tF0kVXvrht/UQwb47E9EsO+G272u3pkZHhQ4aHh09t9jUPy7JsPO/mUzt37rp/dnbmtlZrbgowqqbNvok0TYeLQrfK/luK2ls56FUOZiyLUZS2Ccn3+5KnSwkGkiN5ShoWkSiFyY5EoVW9BGUqIKcaFCF4PqriF/HYW6mYUFtm5VgYylRWhgYHx32zMVXIAmETeDSwWVCyHWwgYphKn4gQpanQtwICQsSpi/8c69PUlKlcCCDUVbwClm8hsK7FS3OQe9Zutzuttc6Zfc05SVOoLJtIs2yYmXOtddtaewSlL/ISwHX9zjVyGrLJvjpZHkKRyq4lBf3B7j1l4uUHPqrQAnGl3ULOC3aHpGZecpTZmhCGK6xr71X9ufIqFOZiDQ0NjlddaNijIc05WB5AH5eAl1I8iHRbiBRrztklA1TBi+oU9EFQ0CXLI7DG5AdM+2ni9ll9W2NMIw9L0mH5301yJGq6ieiiFZVjvUQ5yZwQUamE5aOgtlqZ/B7PZCGul50LpplHWWtVFqUqzUEhJKMsfatOVsVdYncwRZ9JpHIQtnYsbWSkFEzaaPQoABqEFIAWPjolQmq0oEFACr9AqbmdKYhShKpXcZUjLUe8uFXXID8I1ZfvytcQISVQ9DNlcGQ2XAPQoqsuJQSTUW0MlZtnRvndyteZDU1ZAMFESKvT2CkFWDPzomMFCxFGIqRmMVNC0Gijy7+Ta8OpR8zKn3FrbF/nN1/b9zDLk/ohP+WeCCuTmhOtZZXKBpOidGnWtNxftyZmH816mmexF7R8PcRem2umzeeVzyMajQQ5JiWiFGWVPXXPYt/T/BkgJPEYTa6U1ZwKu5jhK+neFWvl+V4c67x4E0GS6yZuq0kCaqdq+mZqx7gJxw0I+MfWin1Swk6UUtSeK9kZjFJWoJhg6PuCxJDHrQhSI5n9qMlAXlcydzzXz/IkyU8Wpfrp4hRp+lsoyw4n9EwTzgNqPnkyA/tLGNaGSVDxyOO/CNbAlzEtbYs9DhtJnZjXkxx4zuEMQoLKBFYmEXa3CeJG1IoRum56AVIGqlgsJXjJyHfIKJqWoP2HoLdk2rCYWO7dSaK8hszSz2rn4grRH+Xo68Qum4QFv8m2JUYN3WJod2U0qoNaOIAsXOjAfqgSQQgDOWY1R4ELHEQlYrwIk5UbRg4sFix2D6eIslk4rMErw5beTnven2wL9UmVr5SxgZjI607HmpOSv+nCHCHxUVY8XCuhpNkLmTSi2tGflp1rgUvJeiVx2xly+mLwvRCX6bxLqcrBBXifU/IvF4BtLdkq+ZNXQPCi3ZyLuDEnrsy9ymXvFdU0CAXTyf13N8/uAz8W8gIQ/RiOSMAB+cJ2E/soylUeSJa1UWm9JI8flp6NlRh0GKhIyPl4JPt5KVQkI8FUZzu3JG57DQpnXOFqxn06kjaWNhoN5WIAIiSle9M2VnEFbRsv2HgFNl4px/hRGe/IJn4LDYg4zPl/7eOC3Wr/aR//BbGEsvGM9xYuVgo/xz63iU1c7FrGlKlgf7vXk42PvJvSMpaB10Rxcav3I8jL2MgnLYa4mgZXT8R35rPKeFLUWu37mvjOPKtYC0JqDlNamhbSYoBPiig2NR+bgkKlVR+7ko3FdXUak13T8nPIhwzhs1nShF1Hudfis2xMmIQ9AnUkTvI0bbiBJ2I8UzlSSs7a8AltwNks40NItfZoqEugwsU+HiLU6kPbOb8swgSZvfmkgv38uFi9SQgZUUiezAlVCEK2IwTk1oiIW4kiEMxuk4UEP3GpprogLG0wQy+ep+daIxHM+cjDNZUW3PAFybGdFTuGdTiiLFTiF6yYiGEUyLTIkW8172n3OHF1PruAJqBzVQmp0kneLEtXEEwkqrbE5l4Kg8NGJPP+cvE84Gp5b+YwkK/1RhCP0KXj6JBHME7w5QlyxFd08My8DdlIIzRs2DfX+E0xgXmsFhXxFSU7ucKZo/pZekELpmQl1TQH2fbW8PDYg0Z+wqeojkAkTRUpZqrR3xblYK+iVlPAcOeF3PMay+nW6P8DwntdPaloa+oAAAAASUVORK5CYII=";

const mkExercise = (id, name, sets, reps, targetWeight, restSets, restAfter, mediaUrl, comments = []) => ({
  id, name, sets, reps, targetWeight, restSets, restAfter, mediaUrl,
  done: false, logWeight: "", logReps: "", showComments: false, comments,
});

const initialAlumnos = [
  {
    id: "a1",
    name: "Lucía Fernández",
    days: [
      {
        day: "Lunes",
        focus: "Pecho / Tríceps",
        exercises: [
          mkExercise("e1", "Press banca", 4, "8-10", "42 kg", 90, 120, "Video demostrativo", [
            { id: "c1", author: "profesor", authorName: "Vos", text: "Bajá controlado, 2 segundos de negativa." },
            { id: "c2", author: "alumno", authorName: "Lucía", text: "Me costó la última serie, ¿bajo el peso el próximo lunes?" },
          ]),
          mkExercise("e2", "Press inclinado mancuernas", 3, "10-12", "16 kg", 60, 90, "Foto de referencia"),
          mkExercise("e3", "Fondos en paralelas", 3, "10", "PC", 60, 90, "Video demostrativo"),
        ],
      },
      {
        day: "Miércoles",
        focus: "Espalda / Bíceps",
        exercises: [
          mkExercise("e4", "Dominadas", 4, "6-8", "PC", 90, 120, "Video demostrativo"),
          mkExercise("e5", "Remo con barra", 4, "8-10", "50 kg", 90, 120, "Foto de referencia"),
        ],
      },
      {
        day: "Viernes",
        focus: "Piernas",
        exercises: [
          mkExercise("e6", "Sentadilla", 4, "6-8", "60 kg", 120, 150, "Video demostrativo"),
          mkExercise("e7", "Prensa", 3, "10-12", "120 kg", 90, 120, "Foto de referencia"),
        ],
      },
    ],
  },
  {
    id: "a2",
    name: "Martín Ríos",
    days: [
      {
        day: "Lunes",
        focus: "Full Body",
        exercises: [
          mkExercise("e8", "Sentadilla", 4, "5", "80 kg", 120, 150, "Video demostrativo"),
          mkExercise("e9", "Press militar", 3, "8", "35 kg", 90, 120, "Foto de referencia"),
        ],
      },
    ],
  },
  {
    id: "a3",
    name: "Sofía Gómez",
    days: [
      {
        day: "Martes",
        focus: "Glúteo / Femoral",
        exercises: [
          mkExercise("e10", "Hip thrust", 4, "10-12", "70 kg", 60, 90, "Video demostrativo"),
          mkExercise("e11", "Peso muerto rumano", 3, "10", "40 kg", 90, 120, "Foto de referencia"),
        ],
      },
    ],
  },
];
initialAlumnos.forEach((a) => a.days.forEach((d) => { d.rpeBorg = null; }));

const BORG_LEVELS = [
  { min: 6, max: 8, label: "Sin esfuerzo / muy leve" },
  { min: 9, max: 10, label: "Muy leve" },
  { min: 11, max: 12, label: "Leve" },
  { min: 13, max: 14, label: "Algo intenso" },
  { min: 15, max: 16, label: "Intenso" },
  { min: 17, max: 18, label: "Muy intenso" },
  { min: 19, max: 20, label: "Esfuerzo máximo" },
];

function borgLabel(v) {
  const found = BORG_LEVELS.find((l) => v >= l.min && v <= l.max);
  return found ? found.label : "";
}

function borgColor(v) {
  if (v <= 10) return "#5B9BC7";
  if (v <= 14) return "#9FD62E";
  if (v <= 17) return "#F2A623";
  return "#E24A3B";
}

function formatTime(s) {
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return `${m}:${String(sec).padStart(2, "0")}`;
}

function BarbellProgress({ pct }) {
  const plateCount = Math.round((pct / 100) * 6);
  return (
    <div className="flex items-center gap-2">
      <div style={{ width: 10, height: 10, borderRadius: 9999, background: COLORS.border }} />
      <div className="flex-1 flex items-center" style={{ height: 6, background: COLORS.border, borderRadius: 3, position: "relative" }}>
        <div style={{ width: `${pct}%`, height: 6, background: COLORS.accent, borderRadius: 3, transition: "width 300ms ease" }} />
      </div>
      <div className="flex gap-[2px]">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            style={{
              width: 5,
              height: i < plateCount ? 22 : 14,
              background: i < plateCount ? COLORS.accent : COLORS.border,
              borderRadius: 1,
              transition: "all 250ms ease",
            }}
          />
        ))}
      </div>
    </div>
  );
}

function MediaBox({ url }) {
  if (!url) {
    return (
      <div
        className="flex items-center gap-2 px-2.5 py-2 rounded-md"
        style={{ background: COLORS.surface2, border: `1px dashed ${COLORS.border}`, width: "fit-content" }}
      >
        <Video size={14} color={COLORS.dim} />
        <span style={{ fontFamily: "Inter", fontSize: 12, color: COLORS.dim }}>Sin media</span>
      </div>
    );
  }
  const esVideo = /\.(mp4|webm|mov|ogg)(\?|$)/i.test(url);
  return (
    <div className="rounded-md overflow-hidden" style={{ width: 180, border: `1px solid ${COLORS.border}` }}>
      {esVideo ? (
        <video src={url} controls style={{ width: "100%", display: "block", maxHeight: 160 }} />
      ) : (
        <img src={url} alt="Demostración del ejercicio" style={{ width: "100%", display: "block", maxHeight: 160, objectFit: "cover" }} />
      )}
    </div>
  );
}

function CommentsPanel({ exercise, onAddComment, currentAuthor, currentAuthorName }) {
  const [draft, setDraft] = useState("");
  const submit = () => {
    if (!draft.trim()) return;
    onAddComment(exercise.id, { id: `c${Date.now()}`, author: currentAuthor, authorName: currentAuthorName, text: draft });
    setDraft("");
  };
  return (
    <div className="flex flex-col gap-2 mt-2" style={{ borderTop: `1px solid ${COLORS.border}`, paddingTop: 10 }}>
      {exercise.comments.length === 0 && (
        <span style={{ fontFamily: "Inter", fontSize: 12, color: COLORS.dim }}>Todavía no hay comentarios en este ejercicio.</span>
      )}
      {exercise.comments.map((c) => (
        <div key={c.id} className="flex flex-col" style={{ maxWidth: "90%" }}>
          <span
            style={{
              fontFamily: "Inter", fontSize: 11, fontWeight: 600,
              color: c.author === "profesor" ? COLORS.accent : COLORS.dim,
            }}
          >
            {c.authorName}
          </span>
          <span
            className="px-2.5 py-1.5 rounded-md mt-0.5"
            style={{
              fontFamily: "Inter", fontSize: 13, color: COLORS.text,
              background: c.author === "profesor" ? "rgba(91,155,199,0.12)" : COLORS.surface2,
              border: `1px solid ${c.author === "profesor" ? COLORS.accentDim : COLORS.border}`,
            }}
          >
            {c.text}
          </span>
        </div>
      ))}
      <div className="flex gap-2 mt-1">
        <input
          value={draft}
          onChange={(ev) => setDraft(ev.target.value)}
          onKeyDown={(ev) => ev.key === "Enter" && submit()}
          placeholder={currentAuthor === "profesor" ? "Escribir una indicación..." : "Dejar tu feedback..."}
          style={{ flex: 1, background: COLORS.surface2, color: COLORS.text, border: `1px solid ${COLORS.border}`, borderRadius: 6, padding: "6px 8px", fontFamily: "Inter", fontSize: 13 }}
        />
        <button onClick={submit} style={{ background: COLORS.accent, borderRadius: 6, padding: "6px 10px", display: "flex", alignItems: "center" }}>
          <Send size={14} color="#101215" />
        </button>
      </div>
    </div>
  );
}

function CalendarGrid({ year, month, markedDates, onSelectDate, selectedDate }) {
  const primerDia = new Date(year, month, 1);
  const ultimoDia = new Date(year, month + 1, 0);
  const diasEnMes = ultimoDia.getDate();
  const offset = primerDia.getDay();
  const celdas = [];
  for (let i = 0; i < offset; i++) celdas.push(null);
  for (let d = 1; d <= diasEnMes; d++) celdas.push(d);

  const pad = (n) => String(n).padStart(2, "0");
  const fechaStr = (d) => `${year}-${pad(month + 1)}-${pad(d)}`;

  return (
    <div>
      <div className="grid grid-cols-7 gap-1 mb-1">
        {["D", "L", "M", "M", "J", "V", "S"].map((d, i) => (
          <div key={i} style={{ fontFamily: "Inter", fontSize: 11, color: COLORS.dim, textAlign: "center" }}>{d}</div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {celdas.map((d, i) => {
          if (d === null) return <div key={i} />;
          const fecha = fechaStr(d);
          const marcado = markedDates[fecha];
          const esSeleccionado = fecha === selectedDate;
          return (
            <button
              key={i}
              onClick={() => onSelectDate(fecha)}
              className="flex flex-col items-center justify-center rounded-md"
              style={{
                aspectRatio: "1",
                background: esSeleccionado ? COLORS.accent : marcado ? "rgba(91,155,199,0.15)" : COLORS.surface2,
                border: `1px solid ${esSeleccionado || marcado ? COLORS.accent : COLORS.border}`,
                color: esSeleccionado ? "#101215" : COLORS.text,
                fontFamily: "JetBrains Mono",
                fontSize: 13,
              }}
              title={marcado || ""}
            >
              {d}
              {marcado && (
                <span style={{ width: 4, height: 4, borderRadius: 9999, background: esSeleccionado ? "#101215" : COLORS.accent, marginTop: 2 }} />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function DiaDetalle({ day, alumnoId, fecha, onLocalUpdate, currentAuthor, currentAuthorName }) {
  const [restTimer, setRestTimer] = useState(null);

  useEffect(() => {
    if (!restTimer || restTimer.secondsLeft <= 0) return;
    const t = setTimeout(() => setRestTimer((prev) => (prev ? { ...prev, secondsLeft: prev.secondsLeft - 1 } : prev)), 1000);
    return () => clearTimeout(t);
  }, [restTimer]);

  const startRest = (exId, seconds) => setRestTimer({ exId, secondsLeft: seconds, total: seconds });

  const toggleDone = (exId) => {
    const actual = day.exercises.find((e) => e.id === exId)?.done;
    onLocalUpdate({ ...day, exercises: day.exercises.map((e) => (e.id === exId ? { ...e, done: !e.done } : e)) });
    api
      .marcarEjercicio({ dayId: day.dayId, alumnoId, diaEjercicioId: exId, hecho: !actual, fecha })
      .catch((err) => alert("No se pudo guardar: " + err.message));
  };

  const updateLog = (exId, field, value) => {
    onLocalUpdate({ ...day, exercises: day.exercises.map((e) => (e.id === exId ? { ...e, [field]: value } : e)) });
  };

  const guardarLogEnBlur = (exId) => {
    const ex = day.exercises.find((e) => e.id === exId);
    if (!ex) return;
    api
      .guardarLog({ dayId: day.dayId, alumnoId, diaEjercicioId: exId, pesoLogrado: ex.logWeight, repsLogradas: ex.logReps, fecha })
      .catch((err) => alert("No se pudo guardar el registro: " + err.message));
  };

  const toggleComments = (exId) => {
    onLocalUpdate({ ...day, exercises: day.exercises.map((e) => (e.id === exId ? { ...e, showComments: !e.showComments } : e)) });
  };

  const addComment = async (exId, comment) => {
    try {
      const guardado = await api.agregarComentario({ diaEjercicioId: exId, autorId: currentAuthor === "profesor" ? comment.autorId : alumnoId, texto: comment.text });
      const comentarioReal = { id: guardado.id, author: currentAuthor, authorName: currentAuthorName, text: comment.text };
      onLocalUpdate({ ...day, exercises: day.exercises.map((e) => (e.id === exId ? { ...e, comments: [...e.comments, comentarioReal] } : e)) });
    } catch (err) {
      alert("No se pudo guardar el comentario: " + err.message);
    }
  };

  const setBorg = (value) => {
    onLocalUpdate({ ...day, rpeBorg: value });
    api.guardarBorg({ dayId: day.dayId, alumnoId, valor: value, fecha }).catch((err) => alert("No se pudo guardar el esfuerzo: " + err.message));
  };

  const pct = Math.round((day.exercises.filter((e) => e.done).length / (day.exercises.length || 1)) * 100) || 0;

  return (
    <div>
      <div className="flex items-baseline gap-2 mb-1">
        <span style={{ fontFamily: "Bebas Neue", fontSize: 24, letterSpacing: 1, color: COLORS.accent }}>{day.day}</span>
        <span style={{ fontFamily: "Inter", fontSize: 13, color: COLORS.dim }}>{day.focus}</span>
      </div>
      <div style={{ fontFamily: "Inter", fontSize: 12, color: COLORS.dim, marginBottom: 14, textTransform: "capitalize" }}>
        {new Date(fecha + "T00:00:00").toLocaleDateString("es-AR", { weekday: "long", day: "numeric", month: "long" })}
      </div>

      <div style={{ marginBottom: 16 }}>
        <BarbellProgress pct={pct} />
      </div>

      <div className="flex flex-col gap-3">
        {day.exercises.map((e) => (
          <div
            key={e.id}
            style={{
              background: COLORS.surface,
              border: `1px solid ${e.done ? COLORS.accentDim : COLORS.border}`,
              borderRadius: 10,
              padding: 14,
              opacity: e.done ? 0.75 : 1,
            }}
          >
            <div className="flex items-center justify-between">
              <div>
                <div style={{ fontFamily: "Inter", fontSize: 15, fontWeight: 600, color: COLORS.text }}>{e.name}</div>
                <div style={{ fontFamily: "JetBrains Mono", fontSize: 12, color: COLORS.dim, marginTop: 2 }}>
                  Objetivo: {e.sets}×{e.reps} · {e.targetWeight}
                </div>
              </div>
              <button
                onClick={() => toggleDone(e.id)}
                style={{
                  width: 32, height: 32, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center",
                  background: e.done ? COLORS.accent : "transparent",
                  border: `1px solid ${e.done ? COLORS.accent : COLORS.border}`,
                  color: e.done ? "#101215" : COLORS.dim,
                }}
              >
                <Check size={16} />
              </button>
            </div>

            <div className="mt-2">
              <MediaBox url={e.mediaUrl} />
            </div>

            <div className="flex gap-2 mt-3 flex-wrap items-center">
              <input
                placeholder="kg"
                value={e.logWeight}
                onChange={(ev) => updateLog(e.id, "logWeight", ev.target.value)}
                onBlur={() => guardarLogEnBlur(e.id)}
                style={{ width: 70, background: COLORS.surface2, color: COLORS.text, border: `1px solid ${COLORS.border}`, borderRadius: 6, padding: "6px 8px", fontFamily: "JetBrains Mono", fontSize: 13 }}
              />
              <input
                placeholder="reps"
                value={e.logReps}
                onChange={(ev) => updateLog(e.id, "logReps", ev.target.value)}
                onBlur={() => guardarLogEnBlur(e.id)}
                style={{ width: 70, background: COLORS.surface2, color: COLORS.text, border: `1px solid ${COLORS.border}`, borderRadius: 6, padding: "6px 8px", fontFamily: "JetBrains Mono", fontSize: 13 }}
              />
              <span style={{ fontFamily: "Inter", fontSize: 12, color: COLORS.dim }}>registrado</span>

              <div className="flex items-center gap-1 ml-auto">
                {restTimer && restTimer.exId === e.id ? (
                  <span
                    className="flex items-center gap-1 px-2.5 py-1.5 rounded-md"
                    style={{ background: "rgba(91,155,199,0.12)", border: `1px solid ${COLORS.accent}`, fontFamily: "JetBrains Mono", fontSize: 13, color: COLORS.accent }}
                  >
                    <Clock size={13} /> {formatTime(restTimer.secondsLeft)}
                  </span>
                ) : (
                  <>
                    <button
                      onClick={() => startRest(e.id, e.restSets)}
                      className="flex items-center gap-1 px-2.5 py-1.5 rounded-md"
                      style={{ background: COLORS.surface2, border: `1px solid ${COLORS.border}`, fontFamily: "Inter", fontSize: 12, color: COLORS.dim }}
                    >
                      <Clock size={12} /> Descanso {e.restSets}s
                    </button>
                    <button
                      onClick={() => startRest(e.id, e.restAfter)}
                      className="flex items-center gap-1 px-2.5 py-1.5 rounded-md"
                      style={{ background: COLORS.surface2, border: `1px solid ${COLORS.border}`, fontFamily: "Inter", fontSize: 12, color: COLORS.dim }}
                    >
                      <Clock size={12} /> Post {e.restAfter}s
                    </button>
                  </>
                )}
              </div>
            </div>

            <button
              onClick={() => toggleComments(e.id)}
              className="flex items-center gap-1.5 mt-3"
              style={{ color: e.comments.length ? COLORS.accent : COLORS.dim, fontFamily: "Inter", fontSize: 12 }}
            >
              <MessageSquare size={13} />
              {e.comments.length > 0 ? `${e.comments.length} comentario${e.comments.length > 1 ? "s" : ""}` : "Dejar feedback"}
            </button>

            {e.showComments && (
              <CommentsPanel exercise={e} onAddComment={addComment} currentAuthor={currentAuthor} currentAuthorName={currentAuthorName} />
            )}
          </div>
        ))}
      </div>

      <div className="mt-5">
        <BorgScale value={day.rpeBorg} onChange={setBorg} />
      </div>
    </div>
  );
}

function CalendarioAlumno({ alumno }) {
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());
  const [programacion, setProgramacion] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [diaDetalle, setDiaDetalle] = useState(null);
  const [cargando, setCargando] = useState(false);

  const cargarMes = () => {
    const desde = `${year}-${String(month + 1).padStart(2, "0")}-01`;
    const ultimoDia = new Date(year, month + 1, 0).getDate();
    const hasta = `${year}-${String(month + 1).padStart(2, "0")}-${String(ultimoDia).padStart(2, "0")}`;
    api.fetchProgramacionRango({ alumnoId: alumno.id, desde, hasta }).then(setProgramacion).catch(() => {});
  };

  useEffect(() => {
    cargarMes();
  }, [year, month, alumno.id]);

  const markedDates = {};
  programacion.forEach((p) => { markedDates[p.fecha] = p.dias?.nombre || "Rutina"; });

  const seleccionar = async (fecha) => {
    setSelectedDate(fecha);
    const prog = programacion.find((p) => p.fecha === fecha);
    if (!prog) { setDiaDetalle(null); return; }
    setCargando(true);
    try {
      const detalle = await api.fetchDiaEnFecha({ dayId: prog.dia_id, alumnoId: alumno.id, fecha });
      setDiaDetalle(detalle);
    } catch (err) {
      alert("No se pudo cargar la rutina de ese día: " + err.message);
    } finally {
      setCargando(false);
    }
  };

  const cambiarMes = (delta) => {
    let m = month + delta;
    let y = year;
    if (m < 0) { m = 11; y--; }
    if (m > 11) { m = 0; y++; }
    setMonth(m);
    setYear(y);
    setSelectedDate(null);
    setDiaDetalle(null);
  };

  const nombreMes = new Date(year, month, 1).toLocaleDateString("es-AR", { month: "long", year: "numeric" });

  return (
    <div className="flex flex-col md:flex-row gap-6" style={{ maxWidth: 720 }}>
      <div style={{ minWidth: 260 }}>
        <div className="flex items-center justify-between mb-3">
          <button onClick={() => cambiarMes(-1)} style={{ color: COLORS.dim }}><ChevronLeft size={16} /></button>
          <span style={{ fontFamily: "Inter", fontSize: 14, fontWeight: 600, color: COLORS.text, textTransform: "capitalize" }}>{nombreMes}</span>
          <button onClick={() => cambiarMes(1)} style={{ color: COLORS.dim }}><ChevronRight size={16} /></button>
        </div>
        <CalendarGrid year={year} month={month} markedDates={markedDates} onSelectDate={seleccionar} selectedDate={selectedDate} />
      </div>

      <div className="flex-1">
        {!selectedDate ? (
          <span style={{ fontFamily: "Inter", fontSize: 13, color: COLORS.dim }}>
            Elegí un día del calendario para ver qué rutina tenías programada.
          </span>
        ) : cargando ? (
          <span style={{ fontFamily: "Inter", fontSize: 13, color: COLORS.dim }}>Cargando...</span>
        ) : !diaDetalle ? (
          <span style={{ fontFamily: "Inter", fontSize: 13, color: COLORS.dim }}>No tenías nada programado para ese día.</span>
        ) : (
          <DiaDetalle day={diaDetalle} alumnoId={alumno.id} fecha={selectedDate} onLocalUpdate={setDiaDetalle} currentAuthor="alumno" currentAuthorName={alumno.name.split(" ")[0]} />
        )}
      </div>
    </div>
  );
}

function CalendarioProfesor({ alumno }) {
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());
  const [programacion, setProgramacion] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [diaDetalle, setDiaDetalle] = useState(null);
  const [cargando, setCargando] = useState(false);
  const [form, setForm] = useState({ dayIdx: 0, fecha: "", repetirHasta: "" });
  const [programando, setProgramando] = useState(false);

  const cargarMes = () => {
    const desde = `${year}-${String(month + 1).padStart(2, "0")}-01`;
    const ultimoDia = new Date(year, month + 1, 0).getDate();
    const hasta = `${year}-${String(month + 1).padStart(2, "0")}-${String(ultimoDia).padStart(2, "0")}`;
    api.fetchProgramacionRango({ alumnoId: alumno.id, desde, hasta }).then(setProgramacion).catch(() => {});
  };

  useEffect(() => {
    cargarMes();
  }, [year, month, alumno.id]);

  const markedDates = {};
  programacion.forEach((p) => { markedDates[p.fecha] = p.dias?.nombre || "Rutina"; });

  const seleccionar = async (fecha) => {
    setSelectedDate(fecha);
    const prog = programacion.find((p) => p.fecha === fecha);
    if (!prog) { setDiaDetalle(null); return; }
    setCargando(true);
    try {
      const detalle = await api.fetchDiaEnFecha({ dayId: prog.dia_id, alumnoId: alumno.id, fecha });
      setDiaDetalle(detalle);
    } catch (err) {
      alert("No se pudo cargar: " + err.message);
    } finally {
      setCargando(false);
    }
  };

  const cambiarMes = (delta) => {
    let m = month + delta;
    let y = year;
    if (m < 0) { m = 11; y--; }
    if (m > 11) { m = 0; y++; }
    setMonth(m);
    setYear(y);
    setSelectedDate(null);
    setDiaDetalle(null);
  };

  const nombreMes = new Date(year, month, 1).toLocaleDateString("es-AR", { month: "long", year: "numeric" });

  const programar = async () => {
    if (!form.fecha || alumno.days.length === 0) return;
    setProgramando(true);
    try {
      await api.programarDia({
        diaId: alumno.days[form.dayIdx].dayId,
        alumnoId: alumno.id,
        fecha: form.fecha,
        repetirHasta: form.repetirHasta || null,
      });
      cargarMes();
      setForm({ ...form, fecha: "", repetirHasta: "" });
    } catch (err) {
      alert("No se pudo programar: " + err.message);
    } finally {
      setProgramando(false);
    }
  };

  const borrarProgramacionActual = async () => {
    const prog = programacion.find((p) => p.fecha === selectedDate);
    if (!prog) return;
    const borrarSerie =
      prog.serie_id &&
      confirm("Esta rutina se repite semanalmente. Aceptar = borrar todas las repeticiones futuras. Cancelar = borrar solo este día.");
    try {
      if (borrarSerie) {
        await api.eliminarSerieProgramacion(prog.serie_id);
      } else {
        await api.eliminarProgramacion(prog.id);
      }
      setDiaDetalle(null);
      setSelectedDate(null);
      cargarMes();
    } catch (err) {
      alert("No se pudo borrar: " + err.message);
    }
  };

  return (
    <div className="flex flex-col gap-6" style={{ maxWidth: 760 }}>
      <div style={{ background: COLORS.surface, border: `1px dashed ${COLORS.border}`, borderRadius: 10, padding: 16 }}>
        <div style={{ fontFamily: "Inter", fontSize: 13, color: COLORS.dim, marginBottom: 10 }}>Programar un día en el calendario</div>
        <div className="flex flex-wrap gap-2 items-center">
          <select
            value={form.dayIdx}
            onChange={(ev) => setForm({ ...form, dayIdx: Number(ev.target.value) })}
            style={{ background: COLORS.surface2, color: COLORS.text, border: `1px solid ${COLORS.border}`, borderRadius: 6, padding: "6px 8px", fontFamily: "Inter", fontSize: 13 }}
          >
            {alumno.days.map((d, idx) => (
              <option key={d.dayId} value={idx}>{d.day} — {d.focus}</option>
            ))}
          </select>
          <input
            type="date"
            value={form.fecha}
            onChange={(ev) => setForm({ ...form, fecha: ev.target.value })}
            style={{ background: COLORS.surface2, color: COLORS.text, border: `1px solid ${COLORS.border}`, borderRadius: 6, padding: "6px 8px", fontFamily: "Inter", fontSize: 13 }}
          />
          <span style={{ fontFamily: "Inter", fontSize: 12, color: COLORS.dim }}>repetir cada semana hasta (opcional)</span>
          <input
            type="date"
            value={form.repetirHasta}
            onChange={(ev) => setForm({ ...form, repetirHasta: ev.target.value })}
            style={{ background: COLORS.surface2, color: COLORS.text, border: `1px solid ${COLORS.border}`, borderRadius: 6, padding: "6px 8px", fontFamily: "Inter", fontSize: 13 }}
          />
          <button
            onClick={programar}
            disabled={programando || !form.fecha}
            className="flex items-center gap-1 px-3 py-1.5 rounded-md"
            style={{ background: COLORS.accent, color: "#101215", fontFamily: "Inter", fontSize: 13, fontWeight: 600, opacity: programando || !form.fecha ? 0.6 : 1 }}
          >
            <Plus size={14} /> {programando ? "Programando..." : "Programar"}
          </button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        <div style={{ minWidth: 260 }}>
          <div className="flex items-center justify-between mb-3">
            <button onClick={() => cambiarMes(-1)} style={{ color: COLORS.dim }}><ChevronLeft size={16} /></button>
            <span style={{ fontFamily: "Inter", fontSize: 14, fontWeight: 600, color: COLORS.text, textTransform: "capitalize" }}>{nombreMes}</span>
            <button onClick={() => cambiarMes(1)} style={{ color: COLORS.dim }}><ChevronRight size={16} /></button>
          </div>
          <CalendarGrid year={year} month={month} markedDates={markedDates} onSelectDate={seleccionar} selectedDate={selectedDate} />
        </div>

        <div className="flex-1">
          {!selectedDate ? (
            <span style={{ fontFamily: "Inter", fontSize: 13, color: COLORS.dim }}>Elegí un día del calendario para ver o editar lo programado.</span>
          ) : cargando ? (
            <span style={{ fontFamily: "Inter", fontSize: 13, color: COLORS.dim }}>Cargando...</span>
          ) : !diaDetalle ? (
            <span style={{ fontFamily: "Inter", fontSize: 13, color: COLORS.dim }}>Nada programado para ese día.</span>
          ) : (
            <>
              <div className="flex justify-end mb-2">
                <button onClick={borrarProgramacionActual} className="flex items-center gap-1 text-xs" style={{ color: COLORS.danger, fontFamily: "Inter" }}>
                  <Trash2 size={13} /> Quitar del calendario
                </button>
              </div>
              <DiaDetalle day={diaDetalle} alumnoId={alumno.id} fecha={selectedDate} onLocalUpdate={setDiaDetalle} currentAuthor="profesor" currentAuthorName="Vos" />
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function CatalogoManager({ catalogo, setCatalogo }) {
  const [newEjercicio, setNewEjercicio] = useState({ nombre: "", grupoMuscular: "" });
  const [creando, setCreando] = useState(false);
  const [subiendoId, setSubiendoId] = useState(null);

  const crear = async () => {
    if (!newEjercicio.nombre.trim()) return;
    setCreando(true);
    try {
      const nuevo = await api.crearEjercicioCatalogo({ nombre: newEjercicio.nombre, grupoMuscular: newEjercicio.grupoMuscular });
      setCatalogo((prev) => [...prev, nuevo].sort((a, b) => a.nombre.localeCompare(b.nombre)));
      setNewEjercicio({ nombre: "", grupoMuscular: "" });
    } catch (err) {
      alert("No se pudo crear el ejercicio: " + err.message);
    } finally {
      setCreando(false);
    }
  };

  const subirMedia = async (ejercicioId, file) => {
    if (!file) return;
    setSubiendoId(ejercicioId);
    try {
      const actualizado = await api.subirMediaEjercicio({ ejercicioId, file });
      setCatalogo((prev) => prev.map((e) => (e.id === ejercicioId ? { ...e, url_media: actualizado.url_media } : e)));
    } catch (err) {
      alert("No se pudo subir el archivo: " + err.message);
    } finally {
      setSubiendoId(null);
    }
  };

  return (
    <div style={{ maxWidth: 640 }}>
      <div style={{ background: COLORS.surface, border: `1px dashed ${COLORS.border}`, borderRadius: 10, padding: 16, marginBottom: 20 }}>
        <div style={{ fontFamily: "Inter", fontSize: 13, color: COLORS.dim, marginBottom: 10 }}>Agregar ejercicio al catálogo</div>
        <div className="flex flex-wrap gap-2">
          <input
            placeholder="Nombre (ej: Curl de bíceps)"
            value={newEjercicio.nombre}
            onChange={(ev) => setNewEjercicio({ ...newEjercicio, nombre: ev.target.value })}
            style={{ background: COLORS.surface2, color: COLORS.text, border: `1px solid ${COLORS.border}`, borderRadius: 6, padding: "6px 8px", fontFamily: "Inter", fontSize: 13, flex: "1 1 180px" }}
          />
          <input
            placeholder="Grupo muscular (opcional)"
            value={newEjercicio.grupoMuscular}
            onChange={(ev) => setNewEjercicio({ ...newEjercicio, grupoMuscular: ev.target.value })}
            style={{ background: COLORS.surface2, color: COLORS.text, border: `1px solid ${COLORS.border}`, borderRadius: 6, padding: "6px 8px", fontFamily: "Inter", fontSize: 13, flex: "1 1 160px" }}
          />
          <button
            onClick={crear}
            disabled={creando}
            className="flex items-center gap-1 px-3 py-1.5 rounded-md"
            style={{ background: COLORS.accent, color: "#101215", fontFamily: "Inter", fontSize: 13, fontWeight: 600, opacity: creando ? 0.6 : 1 }}
          >
            <Plus size={14} /> {creando ? "Creando..." : "Agregar"}
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        {catalogo.length === 0 && (
          <span style={{ fontFamily: "Inter", fontSize: 13, color: COLORS.dim }}>Todavía no tenés ejercicios en el catálogo.</span>
        )}
        {catalogo.map((e) => (
          <div key={e.id} style={{ background: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: 10, padding: 14 }}>
            <div className="flex items-start justify-between gap-4">
              <div>
                <div style={{ fontFamily: "Inter", fontSize: 15, fontWeight: 600, color: COLORS.text }}>{e.nombre}</div>
                {e.grupo_muscular && (
                  <div style={{ fontFamily: "Inter", fontSize: 12, color: COLORS.dim, marginTop: 2 }}>{e.grupo_muscular}</div>
                )}
                <label
                  className="inline-flex items-center gap-1.5 mt-2 px-2.5 py-1.5 rounded-md cursor-pointer"
                  style={{ background: COLORS.surface2, border: `1px solid ${COLORS.border}`, fontFamily: "Inter", fontSize: 12, color: COLORS.dim }}
                >
                  <Video size={12} />
                  {subiendoId === e.id ? "Subiendo..." : e.url_media ? "Reemplazar foto/video" : "Subir foto o video"}
                  <input
                    type="file"
                    accept="image/*,video/*"
                    style={{ display: "none" }}
                    disabled={subiendoId === e.id}
                    onChange={(ev) => subirMedia(e.id, ev.target.files?.[0])}
                  />
                </label>
              </div>
              <MediaBox url={e.url_media} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function PlantillasManager({ alumnos, setAlumnos, catalogo }) {
  const [plantillas, setPlantillas] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [nuevaPlantilla, setNuevaPlantilla] = useState("");
  const [creandoPlantilla, setCreandoPlantilla] = useState(false);
  const [diasPlantilla, setDiasPlantilla] = useState([]);
  const [cargandoDias, setCargandoDias] = useState(false);
  const [newDay, setNewDay] = useState({ nombre: "", foco: "" });
  const [creandoDia, setCreandoDia] = useState(false);
  const [newExercise, setNewExercise] = useState({ dayIdx: 0, ejercicioId: "__nuevo__", nuevoNombre: "", sets: "3", reps: "10", targetWeight: "", restSets: "60", restAfter: "90" });
  const [asignarAlumnoId, setAsignarAlumnoId] = useState("");
  const [asignando, setAsignando] = useState(false);
  const [editandoNombre, setEditandoNombre] = useState(false);
  const [nombreEdit, setNombreEdit] = useState("");
  const [guardandoNombre, setGuardandoNombre] = useState(false);
  const [eliminando, setEliminando] = useState(false);

  useEffect(() => {
    setEditandoNombre(false);
  }, [selectedId]);

  useEffect(() => {
    api.fetchPlantillas().then(setPlantillas).catch(() => {});
  }, []);

  useEffect(() => {
    if (!selectedId) { setDiasPlantilla([]); return; }
    setCargandoDias(true);
    api.fetchDiasDePlantilla(selectedId).then(setDiasPlantilla).catch(() => {}).finally(() => setCargandoDias(false));
  }, [selectedId]);

  const selected = plantillas.find((p) => p.id === selectedId);

  const crear = async () => {
    if (!nuevaPlantilla.trim()) return;
    setCreandoPlantilla(true);
    try {
      const nueva = await api.crearPlantilla({ nombre: nuevaPlantilla });
      setPlantillas((prev) => [...prev, nueva].sort((a, b) => a.nombre.localeCompare(b.nombre)));
      setSelectedId(nueva.id);
      setNuevaPlantilla("");
    } catch (err) {
      alert("No se pudo crear la plantilla: " + err.message);
    } finally {
      setCreandoPlantilla(false);
    }
  };

  const crearDia = async () => {
    if (!newDay.nombre.trim() || !selectedId) return;
    setCreandoDia(true);
    try {
      const dia = await api.agregarDiaAPlantilla({ rutinaId: selectedId, nombre: newDay.nombre, foco: newDay.foco });
      setDiasPlantilla((prev) => [...prev, { dayId: dia.id, day: dia.nombre, focus: dia.foco || "", exercises: [] }]);
      setNewDay({ nombre: "", foco: "" });
    } catch (err) {
      alert("No se pudo crear el día: " + err.message);
    } finally {
      setCreandoDia(false);
    }
  };

  const addExercise = async () => {
    const usandoNuevo = newExercise.ejercicioId === "__nuevo__";
    if (usandoNuevo && !newExercise.nuevoNombre.trim()) return;
    if (diasPlantilla.length === 0) return;
    const day = diasPlantilla[newExercise.dayIdx];
    try {
      const nuevo = usandoNuevo
        ? await api.agregarEjercicioADia({
            dayId: day.dayId,
            nombre: newExercise.nuevoNombre,
            series: Number(newExercise.sets) || 1,
            reps: newExercise.reps,
            pesoObjetivo: newExercise.targetWeight || "-",
            descansoSeries: Number(newExercise.restSets) || 60,
            descansoPosterior: Number(newExercise.restAfter) || 90,
          })
        : await api.agregarEjercicioADiaPorId({
            dayId: day.dayId,
            ejercicioId: newExercise.ejercicioId,
            series: Number(newExercise.sets) || 1,
            reps: newExercise.reps,
            pesoObjetivo: newExercise.targetWeight || "-",
            descansoSeries: Number(newExercise.restSets) || 60,
            descansoPosterior: Number(newExercise.restAfter) || 90,
          });
      const exObj = {
        id: nuevo.id,
        catalogId: nuevo.ejercicios?.id,
        name: nuevo.ejercicios?.nombre || newExercise.nuevoNombre,
        sets: nuevo.series,
        reps: nuevo.reps,
        targetWeight: nuevo.peso_objetivo,
        restSets: nuevo.descanso_series_seg,
        restAfter: nuevo.descanso_posterior_seg,
        mediaUrl: nuevo.ejercicios?.url_media || null,
      };
      setDiasPlantilla((prev) =>
        prev.map((d, idx) => (idx === newExercise.dayIdx ? { ...d, exercises: [...d.exercises, exObj] } : d))
      );
      setNewExercise({ ...newExercise, nuevoNombre: "", targetWeight: "" });
    } catch (err) {
      alert("No se pudo agregar el ejercicio: " + err.message);
    }
  };

  const asignar = async () => {
    if (!asignarAlumnoId || !selected) return;
    setAsignando(true);
    try {
      const { rutina, dias } = await api.asignarPlantillaAAlumno({
        rutinaPlantillaId: selectedId,
        alumnoId: asignarAlumnoId,
        nombreRutina: selected.nombre,
      });
      const nuevosDias = dias.map((d) => ({
        day: d.day,
        focus: d.focus,
        dayId: d.dayId,
        rpeBorg: null,
        exercises: d.exercises.map((ex) =>
          mkExercise(ex.id, ex.ejercicios?.nombre, ex.series, ex.reps, ex.peso_objetivo, ex.descanso_series_seg, ex.descanso_posterior_seg, ex.ejercicios?.url_media || null)
        ),
      }));
      setAlumnos((prev) => prev.map((a) => (a.id === asignarAlumnoId ? { ...a, rutinaId: rutina.id, days: nuevosDias } : a)));
      alert("Rutina asignada correctamente.");
      setAsignarAlumnoId("");
    } catch (err) {
      alert("No se pudo asignar la plantilla: " + err.message);
    } finally {
      setAsignando(false);
    }
  };

  const guardarNombre = async () => {
    if (!nombreEdit.trim() || !selectedId) return;
    setGuardandoNombre(true);
    try {
      const actualizado = await api.renombrarPlantilla({ rutinaId: selectedId, nombre: nombreEdit });
      setPlantillas((prev) =>
        prev.map((p) => (p.id === selectedId ? { ...p, nombre: actualizado.nombre } : p)).sort((a, b) => a.nombre.localeCompare(b.nombre))
      );
      setEditandoNombre(false);
    } catch (err) {
      alert("No se pudo renombrar la plantilla: " + err.message);
    } finally {
      setGuardandoNombre(false);
    }
  };

  const eliminarPlantillaActual = async () => {
    if (!selectedId || !selected) return;
    if (!confirm(`¿Borrar la plantilla "${selected.nombre}"? Esto no afecta a los alumnos que ya la tengan asignada, solo elimina la plantilla en sí.`)) return;
    setEliminando(true);
    try {
      await api.eliminarPlantilla(selectedId);
      setPlantillas((prev) => prev.filter((p) => p.id !== selectedId));
      setSelectedId(null);
    } catch (err) {
      alert("No se pudo borrar la plantilla: " + err.message);
    } finally {
      setEliminando(false);
    }
  };

  return (
    <div className="flex gap-6 w-full" style={{ minHeight: 480 }}>
      <div className="w-56 shrink-0">
        <div className="text-xs uppercase tracking-wider mb-3 flex items-center gap-2" style={{ color: COLORS.dim, fontFamily: "Inter" }}>
          <Layers size={14} /> Plantillas
        </div>
        <div className="flex flex-col gap-1">
          {plantillas.map((p) => (
            <button
              key={p.id}
              onClick={() => setSelectedId(p.id)}
              className="text-left px-3 py-2.5 rounded-md flex items-center justify-between transition-colors"
              style={{
                background: selectedId === p.id ? COLORS.surface2 : "transparent",
                border: `1px solid ${selectedId === p.id ? COLORS.accent : "transparent"}`,
                color: selectedId === p.id ? COLORS.text : COLORS.dim,
              }}
            >
              <span style={{ fontFamily: "Inter", fontSize: 14, fontWeight: 500 }}>{p.nombre}</span>
              <ChevronRight size={14} />
            </button>
          ))}
        </div>

        <div className="mt-4 pt-4" style={{ borderTop: `1px solid ${COLORS.border}` }}>
          <div style={{ fontFamily: "Inter", fontSize: 12, color: COLORS.dim, marginBottom: 8 }}>Crear plantilla</div>
          <div className="flex flex-col gap-2">
            <input
              placeholder="Nombre (ej: Hipertrofia 4 días)"
              value={nuevaPlantilla}
              onChange={(ev) => setNuevaPlantilla(ev.target.value)}
              style={{ width: "100%", background: COLORS.surface2, color: COLORS.text, border: `1px solid ${COLORS.border}`, borderRadius: 6, padding: "6px 8px", fontFamily: "Inter", fontSize: 13, boxSizing: "border-box" }}
            />
            <button
              onClick={crear}
              disabled={creandoPlantilla}
              className="flex items-center justify-center gap-1 px-3 py-1.5 rounded-md"
              style={{ background: COLORS.accent, color: "#101215", fontFamily: "Inter", fontSize: 13, fontWeight: 600, opacity: creandoPlantilla ? 0.6 : 1 }}
            >
              <Plus size={14} /> {creandoPlantilla ? "Creando..." : "Crear"}
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1">
        {!selected ? (
          <div style={{ fontFamily: "Inter", fontSize: 13, color: COLORS.dim }}>
            Creá o seleccioná una plantilla para editarla.
          </div>
        ) : (
        <>
        {editandoNombre ? (
          <div className="flex items-center gap-2">
            <input
              value={nombreEdit}
              onChange={(ev) => setNombreEdit(ev.target.value)}
              autoFocus
              style={{ background: COLORS.surface2, color: COLORS.text, border: `1px solid ${COLORS.accent}`, borderRadius: 6, padding: "6px 10px", fontFamily: "Inter", fontSize: 18, fontWeight: 600 }}
            />
            <button
              onClick={guardarNombre}
              disabled={guardandoNombre}
              className="px-3 py-1.5 rounded-md"
              style={{ background: COLORS.accent, color: "#101215", fontFamily: "Inter", fontSize: 13, fontWeight: 600, opacity: guardandoNombre ? 0.6 : 1 }}
            >
              {guardandoNombre ? "Guardando..." : "Guardar"}
            </button>
            <button
              onClick={() => setEditandoNombre(false)}
              className="px-3 py-1.5 rounded-md"
              style={{ background: COLORS.surface2, color: COLORS.dim, fontFamily: "Inter", fontSize: 13 }}
            >
              Cancelar
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <div style={{ fontFamily: "Bebas Neue", fontSize: 30, letterSpacing: 1, color: COLORS.text }}>{selected.nombre}</div>
            <button
              onClick={() => { setNombreEdit(selected.nombre); setEditandoNombre(true); }}
              style={{ color: COLORS.dim }}
              title="Renombrar"
            >
              <Pencil size={16} />
            </button>
            <button
              onClick={eliminarPlantillaActual}
              disabled={eliminando}
              style={{ color: COLORS.danger, opacity: eliminando ? 0.6 : 1 }}
              title="Borrar plantilla"
            >
              <Trash2 size={16} />
            </button>
          </div>
        )}

        <div className="flex flex-wrap items-center gap-2 mt-3 mb-5 p-3 rounded-md" style={{ background: COLORS.surface, border: `1px solid ${COLORS.border}` }}>
          <Copy size={14} color={COLORS.accent} />
          <span style={{ fontFamily: "Inter", fontSize: 13, color: COLORS.dim }}>Asignar esta plantilla a:</span>
          <select
            value={asignarAlumnoId}
            onChange={(ev) => setAsignarAlumnoId(ev.target.value)}
            style={{ background: COLORS.surface2, color: COLORS.text, border: `1px solid ${COLORS.border}`, borderRadius: 6, padding: "6px 8px", fontFamily: "Inter", fontSize: 13 }}
          >
            <option value="">Elegir alumno...</option>
            {alumnos.map((a) => (
              <option key={a.id} value={a.id}>{a.name}</option>
            ))}
          </select>
          <button
            onClick={asignar}
            disabled={asignando || !asignarAlumnoId}
            className="px-3 py-1.5 rounded-md"
            style={{ background: COLORS.accent, color: "#101215", fontFamily: "Inter", fontSize: 13, fontWeight: 600, opacity: asignando || !asignarAlumnoId ? 0.6 : 1 }}
          >
            {asignando ? "Asignando..." : "Asignar"}
          </button>
        </div>

        {cargandoDias ? (
          <span style={{ fontFamily: "Inter", fontSize: 13, color: COLORS.dim }}>Cargando días...</span>
        ) : (
        <div className="flex flex-col gap-5">
          {diasPlantilla.map((d, dayIdx) => (
            <div key={d.dayId} style={{ background: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: 10, padding: 16 }}>
              <div className="flex items-baseline gap-2 mb-3">
                <span style={{ fontFamily: "Bebas Neue", fontSize: 18, color: COLORS.accent, letterSpacing: 1 }}>{d.day}</span>
                <span style={{ fontFamily: "Inter", fontSize: 13, color: COLORS.dim }}>{d.focus}</span>
              </div>
              <div className="flex flex-col gap-2">
                {d.exercises.map((e) => (
                  <div key={e.id} className="rounded-md px-3 py-2" style={{ background: COLORS.surface2 }}>
                    <div className="flex items-center justify-between">
                      <span style={{ fontFamily: "Inter", fontSize: 14, color: COLORS.text }}>{e.name}</span>
                      <span style={{ fontFamily: "JetBrains Mono", fontSize: 12, color: COLORS.dim }}>
                        {e.sets}×{e.reps} · {e.targetWeight}
                      </span>
                    </div>
                    <div className="mt-2">
                      <MediaBox url={e.mediaUrl} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}

          {diasPlantilla.length > 0 && (
            <div style={{ background: COLORS.surface, border: `1px dashed ${COLORS.border}`, borderRadius: 10, padding: 16 }}>
              <div style={{ fontFamily: "Inter", fontSize: 13, color: COLORS.dim, marginBottom: 10 }}>Agregar ejercicio</div>
              <div className="flex flex-wrap gap-2">
                <select
                  value={newExercise.dayIdx}
                  onChange={(ev) => setNewExercise({ ...newExercise, dayIdx: Number(ev.target.value) })}
                  style={{ background: COLORS.surface2, color: COLORS.text, border: `1px solid ${COLORS.border}`, borderRadius: 6, padding: "6px 8px", fontFamily: "Inter", fontSize: 13 }}
                >
                  {diasPlantilla.map((d, idx) => (
                    <option key={d.dayId} value={idx}>{d.day}</option>
                  ))}
                </select>
                <select
                  value={newExercise.ejercicioId}
                  onChange={(ev) => setNewExercise({ ...newExercise, ejercicioId: ev.target.value })}
                  style={{ background: COLORS.surface2, color: COLORS.text, border: `1px solid ${COLORS.border}`, borderRadius: 6, padding: "6px 8px", fontFamily: "Inter", fontSize: 13, flex: "1 1 180px" }}
                >
                  <option value="__nuevo__">+ Nuevo ejercicio...</option>
                  {catalogo.map((e) => (
                    <option key={e.id} value={e.id}>{e.nombre}</option>
                  ))}
                </select>
                {newExercise.ejercicioId === "__nuevo__" && (
                  <input
                    placeholder="Nombre del ejercicio nuevo"
                    value={newExercise.nuevoNombre}
                    onChange={(ev) => setNewExercise({ ...newExercise, nuevoNombre: ev.target.value })}
                    style={{ background: COLORS.surface2, color: COLORS.text, border: `1px solid ${COLORS.border}`, borderRadius: 6, padding: "6px 8px", fontFamily: "Inter", fontSize: 13, flex: "1 1 160px" }}
                  />
                )}
                <input
                  placeholder="Series"
                  value={newExercise.sets}
                  onChange={(ev) => setNewExercise({ ...newExercise, sets: ev.target.value })}
                  style={{ width: 60, background: COLORS.surface2, color: COLORS.text, border: `1px solid ${COLORS.border}`, borderRadius: 6, padding: "6px 8px", fontFamily: "Inter", fontSize: 13 }}
                />
                <input
                  placeholder="Reps"
                  value={newExercise.reps}
                  onChange={(ev) => setNewExercise({ ...newExercise, reps: ev.target.value })}
                  style={{ width: 70, background: COLORS.surface2, color: COLORS.text, border: `1px solid ${COLORS.border}`, borderRadius: 6, padding: "6px 8px", fontFamily: "Inter", fontSize: 13 }}
                />
                <input
                  placeholder="Peso objetivo"
                  value={newExercise.targetWeight}
                  onChange={(ev) => setNewExercise({ ...newExercise, targetWeight: ev.target.value })}
                  style={{ width: 100, background: COLORS.surface2, color: COLORS.text, border: `1px solid ${COLORS.border}`, borderRadius: 6, padding: "6px 8px", fontFamily: "Inter", fontSize: 13 }}
                />
                <input
                  placeholder="Descanso series (s)"
                  value={newExercise.restSets}
                  onChange={(ev) => setNewExercise({ ...newExercise, restSets: ev.target.value })}
                  style={{ width: 130, background: COLORS.surface2, color: COLORS.text, border: `1px solid ${COLORS.border}`, borderRadius: 6, padding: "6px 8px", fontFamily: "Inter", fontSize: 13 }}
                />
                <input
                  placeholder="Descanso post (s)"
                  value={newExercise.restAfter}
                  onChange={(ev) => setNewExercise({ ...newExercise, restAfter: ev.target.value })}
                  style={{ width: 130, background: COLORS.surface2, color: COLORS.text, border: `1px solid ${COLORS.border}`, borderRadius: 6, padding: "6px 8px", fontFamily: "Inter", fontSize: 13 }}
                />
                <button
                  onClick={addExercise}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-md"
                  style={{ background: COLORS.accent, color: "#101215", fontFamily: "Inter", fontSize: 13, fontWeight: 600 }}
                >
                  <Plus size={14} /> Agregar
                </button>
              </div>
            </div>
          )}

          <div style={{ background: COLORS.surface, border: `1px dashed ${COLORS.border}`, borderRadius: 10, padding: 16 }}>
            <div style={{ fontFamily: "Inter", fontSize: 13, color: COLORS.dim, marginBottom: 10 }}>Agregar día</div>
            <div className="flex flex-wrap gap-2">
              <input
                placeholder="Nombre del día (ej: Lunes)"
                value={newDay.nombre}
                onChange={(ev) => setNewDay({ ...newDay, nombre: ev.target.value })}
                style={{ width: 200, background: COLORS.surface2, color: COLORS.text, border: `1px solid ${COLORS.border}`, borderRadius: 6, padding: "6px 8px", fontFamily: "Inter", fontSize: 13 }}
              />
              <input
                placeholder="Foco (ej: Pecho / Tríceps)"
                value={newDay.foco}
                onChange={(ev) => setNewDay({ ...newDay, foco: ev.target.value })}
                style={{ width: 220, background: COLORS.surface2, color: COLORS.text, border: `1px solid ${COLORS.border}`, borderRadius: 6, padding: "6px 8px", fontFamily: "Inter", fontSize: 13 }}
              />
              <button
                onClick={crearDia}
                disabled={creandoDia}
                className="flex items-center gap-1 px-3 py-1.5 rounded-md"
                style={{ background: COLORS.accent, color: "#101215", fontFamily: "Inter", fontSize: 13, fontWeight: 600, opacity: creandoDia ? 0.6 : 1 }}
              >
                <Plus size={14} /> {creandoDia ? "Creando..." : "Agregar día"}
              </button>
            </div>
          </div>
        </div>
        )}
        </>
        )}
      </div>
    </div>
  );
}

function ProfesorView({ alumnos, setAlumnos, usuario }) {
  const [section, setSection] = useState("alumnos");
  const [selectedId, setSelectedId] = useState(alumnos[0]?.id);
  const [newExercise, setNewExercise] = useState({ dayIdx: 0, ejercicioId: "__nuevo__", nuevoNombre: "", sets: "3", reps: "10", targetWeight: "", restSets: "60", restAfter: "90" });
  const [newAlumno, setNewAlumno] = useState({ nombre: "", email: "" });
  const [creandoAlumno, setCreandoAlumno] = useState(false);
  const [credencialesNuevoAlumno, setCredencialesNuevoAlumno] = useState(null);
  const [newDay, setNewDay] = useState({ nombre: "", foco: "" });
  const [creandoDia, setCreandoDia] = useState(false);
  const [catalogo, setCatalogo] = useState([]);
  const [vistaAlumno, setVistaAlumno] = useState("rutina");
  const selected = alumnos.find((a) => a.id === selectedId);

  useEffect(() => {
    api.fetchCatalogoEjercicios().then(setCatalogo).catch(() => {});
  }, []);

  const crearAlumno = async () => {
    if (!newAlumno.nombre.trim() || !newAlumno.email.trim()) return;
    setCreandoAlumno(true);
    try {
      const { alumnoId, password } = await api.crearAlumno({ nombre: newAlumno.nombre, email: newAlumno.email });
      setAlumnos((prev) => [...prev, { id: alumnoId, name: newAlumno.nombre, rutinaId: null, days: [] }]);
      setCredencialesNuevoAlumno({ email: newAlumno.email, password });
      setNewAlumno({ nombre: "", email: "" });
    } catch (err) {
      alert("No se pudo crear el alumno: " + err.message);
    } finally {
      setCreandoAlumno(false);
    }
  };

  const crearDia = async () => {
    if (!newDay.nombre.trim() || !selected) return;
    setCreandoDia(true);
    try {
      const dia = await api.agregarDia({ alumnoId: selected.id, nombre: newDay.nombre, foco: newDay.foco });
      setAlumnos((prev) =>
        prev.map((a) =>
          a.id !== selected.id
            ? a
            : { ...a, days: [...a.days, { day: dia.nombre, focus: dia.foco || "", dayId: dia.id, rpeBorg: null, exercises: [] }] }
        )
      );
      setNewDay({ nombre: "", foco: "" });
    } catch (err) {
      alert("No se pudo crear el día: " + err.message);
    } finally {
      setCreandoDia(false);
    }
  };

  const addExercise = async () => {
    const usandoNuevo = newExercise.ejercicioId === "__nuevo__";
    if (usandoNuevo && !newExercise.nuevoNombre.trim()) return;
    if (!selected) return;
    const day = selected.days[newExercise.dayIdx];
    try {
      const nuevo = usandoNuevo
        ? await api.agregarEjercicioADia({
            dayId: day.dayId,
            nombre: newExercise.nuevoNombre,
            series: Number(newExercise.sets) || 1,
            reps: newExercise.reps,
            pesoObjetivo: newExercise.targetWeight || "-",
            descansoSeries: Number(newExercise.restSets) || 60,
            descansoPosterior: Number(newExercise.restAfter) || 90,
          })
        : await api.agregarEjercicioADiaPorId({
            dayId: day.dayId,
            ejercicioId: newExercise.ejercicioId,
            series: Number(newExercise.sets) || 1,
            reps: newExercise.reps,
            pesoObjetivo: newExercise.targetWeight || "-",
            descansoSeries: Number(newExercise.restSets) || 60,
            descansoPosterior: Number(newExercise.restAfter) || 90,
          });
      if (usandoNuevo && nuevo.ejercicios) {
        setCatalogo((prev) =>
          prev.find((e) => e.id === nuevo.ejercicios.id)
            ? prev
            : [...prev, { id: nuevo.ejercicios.id, nombre: nuevo.ejercicios.nombre, url_media: nuevo.ejercicios.url_media }].sort((a, b) => a.nombre.localeCompare(b.nombre))
        );
      }
      const exerciseObj = mkExercise(
        nuevo.id,
        nuevo.ejercicios?.nombre || newExercise.nuevoNombre,
        nuevo.series,
        nuevo.reps,
        nuevo.peso_objetivo,
        nuevo.descanso_series_seg,
        nuevo.descanso_posterior_seg,
        nuevo.ejercicios?.url_media || null
      );
      exerciseObj.catalogId = nuevo.ejercicios?.id;
      setAlumnos((prev) =>
        prev.map((a) => {
          if (a.id !== selectedId) return a;
          const days = a.days.map((d, idx) =>
            idx === newExercise.dayIdx ? { ...d, exercises: [...d.exercises, exerciseObj] } : d
          );
          return { ...a, days };
        })
      );
      setNewExercise({ ...newExercise, nuevoNombre: "", targetWeight: "" });
    } catch (err) {
      alert("No se pudo agregar el ejercicio: " + err.message);
    }
  };

  const removeExercise = async (dayIdx, exId) => {
    try {
      await api.eliminarEjercicioDeDia(exId);
      setAlumnos((prev) =>
        prev.map((a) => {
          if (a.id !== selectedId) return a;
          const days = a.days.map((d, idx) =>
            idx === dayIdx ? { ...d, exercises: d.exercises.filter((e) => e.id !== exId) } : d
          );
          return { ...a, days };
        })
      );
    } catch (err) {
      alert("No se pudo borrar el ejercicio: " + err.message);
    }
  };

  const toggleComments = (dayIdx, exId) => {
    setAlumnos((prev) =>
      prev.map((a) => {
        if (a.id !== selectedId) return a;
        const days = a.days.map((d, idx) =>
          idx === dayIdx
            ? { ...d, exercises: d.exercises.map((e) => (e.id === exId ? { ...e, showComments: !e.showComments } : e)) }
            : d
        );
        return { ...a, days };
      })
    );
  };

  const addComment = async (dayIdx, exId, comment) => {
    try {
      const guardado = await api.agregarComentario({ diaEjercicioId: exId, autorId: usuario.id, texto: comment.text });
      const comentarioReal = { id: guardado.id, author: "profesor", authorName: usuario.nombre, text: comment.text };
      setAlumnos((prev) =>
        prev.map((a) => {
          if (a.id !== selectedId) return a;
          const days = a.days.map((d, idx) =>
            idx === dayIdx
              ? { ...d, exercises: d.exercises.map((e) => (e.id === exId ? { ...e, comments: [...e.comments, comentarioReal] } : e)) }
              : d
          );
          return { ...a, days };
        })
      );
    } catch (err) {
      alert("No se pudo guardar el comentario: " + err.message);
    }
  };

  return (
    <div className="w-full">
      <div className="flex gap-1 p-1 rounded-full mb-6" style={{ background: COLORS.surface, width: "fit-content" }}>
        <button
          onClick={() => setSection("alumnos")}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full"
          style={{
            fontFamily: "Inter", fontSize: 13, fontWeight: 600,
            background: section === "alumnos" ? COLORS.accent : "transparent",
            color: section === "alumnos" ? "#101215" : COLORS.dim,
          }}
        >
          <Users size={14} /> Mis alumnos
        </button>
        <button
          onClick={() => setSection("plantillas")}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full"
          style={{
            fontFamily: "Inter", fontSize: 13, fontWeight: 600,
            background: section === "plantillas" ? COLORS.accent : "transparent",
            color: section === "plantillas" ? "#101215" : COLORS.dim,
          }}
        >
          <Layers size={14} /> Plantillas
        </button>
        <button
          onClick={() => setSection("catalogo")}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full"
          style={{
            fontFamily: "Inter", fontSize: 13, fontWeight: 600,
            background: section === "catalogo" ? COLORS.accent : "transparent",
            color: section === "catalogo" ? "#101215" : COLORS.dim,
          }}
        >
          <Video size={14} /> Catálogo de ejercicios
        </button>
      </div>

      {section === "catalogo" ? (
        <CatalogoManager catalogo={catalogo} setCatalogo={setCatalogo} />
      ) : section === "plantillas" ? (
        <PlantillasManager alumnos={alumnos} setAlumnos={setAlumnos} catalogo={catalogo} />
      ) : (
    <div className="flex gap-6 w-full" style={{ minHeight: 480 }}>
      <div className="w-56 shrink-0">
        <div className="text-xs uppercase tracking-wider mb-3 flex items-center gap-2" style={{ color: COLORS.dim, fontFamily: "Inter" }}>
          <Users size={14} /> Alumnos
        </div>
        <div className="flex flex-col gap-1">
          {alumnos.map((a) => (
            <button
              key={a.id}
              onClick={() => setSelectedId(a.id)}
              className="text-left px-3 py-2.5 rounded-md flex items-center justify-between transition-colors"
              style={{
                background: selectedId === a.id ? COLORS.surface2 : "transparent",
                border: `1px solid ${selectedId === a.id ? COLORS.accent : "transparent"}`,
                color: selectedId === a.id ? COLORS.text : COLORS.dim,
              }}
            >
              <span style={{ fontFamily: "Inter", fontSize: 14, fontWeight: 500 }}>{a.name}</span>
              <ChevronRight size={14} />
            </button>
          ))}
        </div>

        <div className="mt-4 pt-4" style={{ borderTop: `1px solid ${COLORS.border}` }}>
          <div style={{ fontFamily: "Inter", fontSize: 12, color: COLORS.dim, marginBottom: 8 }}>Agregar alumno</div>
          <div className="flex flex-col gap-2">
            <input
              placeholder="Nombre"
              value={newAlumno.nombre}
              onChange={(ev) => setNewAlumno({ ...newAlumno, nombre: ev.target.value })}
              style={{ width: "100%", background: COLORS.surface2, color: COLORS.text, border: `1px solid ${COLORS.border}`, borderRadius: 6, padding: "6px 8px", fontFamily: "Inter", fontSize: 13, boxSizing: "border-box" }}
            />
            <input
              placeholder="Email"
              value={newAlumno.email}
              onChange={(ev) => setNewAlumno({ ...newAlumno, email: ev.target.value })}
              style={{ width: "100%", background: COLORS.surface2, color: COLORS.text, border: `1px solid ${COLORS.border}`, borderRadius: 6, padding: "6px 8px", fontFamily: "Inter", fontSize: 13, boxSizing: "border-box" }}
            />
            <button
              onClick={crearAlumno}
              disabled={creandoAlumno}
              className="flex items-center justify-center gap-1 px-3 py-1.5 rounded-md"
              style={{ background: COLORS.accent, color: "#101215", fontFamily: "Inter", fontSize: 13, fontWeight: 600, opacity: creandoAlumno ? 0.6 : 1 }}
            >
              <Plus size={14} /> {creandoAlumno ? "Creando..." : "Crear"}
            </button>
          </div>
          {credencialesNuevoAlumno && (
            <div className="mt-3 px-3 py-2 rounded-md" style={{ background: COLORS.surface2, border: `1px solid ${COLORS.accent}` }}>
              <div style={{ fontFamily: "Inter", fontSize: 11, color: COLORS.dim }}>Compartile al alumno:</div>
              <div style={{ fontFamily: "JetBrains Mono", fontSize: 12, color: COLORS.text, marginTop: 4 }}>{credencialesNuevoAlumno.email}</div>
              <div style={{ fontFamily: "JetBrains Mono", fontSize: 12, color: COLORS.accent }}>{credencialesNuevoAlumno.password}</div>
              <div style={{ fontFamily: "Inter", fontSize: 10, color: COLORS.dim, marginTop: 4 }}>
                Debe confirmar su email antes de poder entrar.
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="flex-1">
        {!selected ? (
          <div style={{ fontFamily: "Inter", fontSize: 13, color: COLORS.dim }}>
            Creá tu primer alumno con el formulario de la izquierda para empezar.
          </div>
        ) : (
        <>
        <div className="flex items-center gap-3 mb-4">
          <div style={{ fontFamily: "Bebas Neue", fontSize: 30, letterSpacing: 1, color: COLORS.text }}>{selected.name}</div>
          <div className="flex gap-1 p-1 rounded-full" style={{ background: COLORS.surface }}>
            <button
              onClick={() => setVistaAlumno("rutina")}
              className="px-3 py-1 rounded-full"
              style={{
                fontFamily: "Inter", fontSize: 12, fontWeight: 600,
                background: vistaAlumno === "rutina" ? COLORS.accent : "transparent",
                color: vistaAlumno === "rutina" ? "#101215" : COLORS.dim,
              }}
            >
              Rutina
            </button>
            <button
              onClick={() => setVistaAlumno("progreso")}
              className="px-3 py-1 rounded-full flex items-center gap-1"
              style={{
                fontFamily: "Inter", fontSize: 12, fontWeight: 600,
                background: vistaAlumno === "progreso" ? COLORS.accent : "transparent",
                color: vistaAlumno === "progreso" ? "#101215" : COLORS.dim,
              }}
            >
              <TrendingUp size={12} /> Progreso
            </button>
            <button
              onClick={() => setVistaAlumno("calendario")}
              className="px-3 py-1 rounded-full flex items-center gap-1"
              style={{
                fontFamily: "Inter", fontSize: 12, fontWeight: 600,
                background: vistaAlumno === "calendario" ? COLORS.accent : "transparent",
                color: vistaAlumno === "calendario" ? "#101215" : COLORS.dim,
              }}
            >
              <CalendarDays size={12} /> Calendario
            </button>
          </div>
        </div>
        {vistaAlumno === "progreso" ? (
          <ProgresoView alumnoId={selected.id} />
        ) : vistaAlumno === "calendario" ? (
          <CalendarioProfesor alumno={selected} />
        ) : (
        <>
        <div className="mt-4 flex flex-col gap-5">
          {selected.days.map((d, dayIdx) => (
            <div key={d.day} style={{ background: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: 10, padding: 16 }}>
              <div className="flex items-baseline gap-2 mb-3">
                <span style={{ fontFamily: "Bebas Neue", fontSize: 18, color: COLORS.accent, letterSpacing: 1 }}>{d.day}</span>
                <span style={{ fontFamily: "Inter", fontSize: 13, color: COLORS.dim }}>{d.focus}</span>
                {d.rpeBorg !== null && (
                  <span
                    className="flex items-center gap-1 px-2 py-0.5 rounded-full ml-auto"
                    style={{ background: `${borgColor(d.rpeBorg)}22`, border: `1px solid ${borgColor(d.rpeBorg)}` }}
                  >
                    <span style={{ fontFamily: "JetBrains Mono", fontSize: 12, fontWeight: 700, color: borgColor(d.rpeBorg) }}>{d.rpeBorg}</span>
                    <span style={{ fontFamily: "Inter", fontSize: 11, color: borgColor(d.rpeBorg) }}>{borgLabel(d.rpeBorg)}</span>
                  </span>
                )}
              </div>
              <div className="flex flex-col gap-2">
                {d.exercises.map((e) => (
                  <div key={e.id} className="rounded-md px-3 py-2" style={{ background: COLORS.surface2 }}>
                    <div className="flex items-center justify-between">
                      <span style={{ fontFamily: "Inter", fontSize: 14, color: COLORS.text }}>{e.name}</span>
                      <div className="flex items-center gap-3">
                        <span style={{ fontFamily: "JetBrains Mono", fontSize: 12, color: COLORS.dim }}>
                          {e.sets}×{e.reps} · {e.targetWeight}
                        </span>
                        <span className="flex items-center gap-1" style={{ fontFamily: "JetBrains Mono", fontSize: 11, color: COLORS.dim }}>
                          <Clock size={11} /> {e.restSets}s / {e.restAfter}s
                        </span>
                        <button onClick={() => toggleComments(dayIdx, e.id)} className="flex items-center gap-1" style={{ color: e.comments.length ? COLORS.accent : COLORS.dim }}>
                          <MessageSquare size={14} />
                          {e.comments.length > 0 && <span style={{ fontFamily: "JetBrains Mono", fontSize: 11 }}>{e.comments.length}</span>}
                        </button>
                        <button onClick={() => removeExercise(dayIdx, e.id)} style={{ color: COLORS.dim }}>
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                    <div className="mt-2">
                      <MediaBox url={e.mediaUrl} />
                    </div>
                    {e.showComments && (
                      <CommentsPanel exercise={e} onAddComment={(exId, c) => addComment(dayIdx, exId, c)} currentAuthor="profesor" currentAuthorName="Vos" />
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}

          <div style={{ background: COLORS.surface, border: `1px dashed ${COLORS.border}`, borderRadius: 10, padding: 16 }}>
            <div style={{ fontFamily: "Inter", fontSize: 13, color: COLORS.dim, marginBottom: 10 }}>Agregar ejercicio</div>
            <div className="flex flex-wrap gap-2">
              <select
                value={newExercise.dayIdx}
                onChange={(ev) => setNewExercise({ ...newExercise, dayIdx: Number(ev.target.value) })}
                style={{ background: COLORS.surface2, color: COLORS.text, border: `1px solid ${COLORS.border}`, borderRadius: 6, padding: "6px 8px", fontFamily: "Inter", fontSize: 13 }}
              >
                {selected.days.map((d, idx) => (
                  <option key={d.day} value={idx}>{d.day}</option>
                ))}
              </select>
              <select
                value={newExercise.ejercicioId}
                onChange={(ev) => setNewExercise({ ...newExercise, ejercicioId: ev.target.value })}
                style={{ background: COLORS.surface2, color: COLORS.text, border: `1px solid ${COLORS.border}`, borderRadius: 6, padding: "6px 8px", fontFamily: "Inter", fontSize: 13, flex: "1 1 180px" }}
              >
                <option value="__nuevo__">+ Nuevo ejercicio...</option>
                {catalogo.map((e) => (
                  <option key={e.id} value={e.id}>{e.nombre}</option>
                ))}
              </select>
              {newExercise.ejercicioId === "__nuevo__" && (
                <input
                  placeholder="Nombre del ejercicio nuevo"
                  value={newExercise.nuevoNombre}
                  onChange={(ev) => setNewExercise({ ...newExercise, nuevoNombre: ev.target.value })}
                  style={{ background: COLORS.surface2, color: COLORS.text, border: `1px solid ${COLORS.border}`, borderRadius: 6, padding: "6px 8px", fontFamily: "Inter", fontSize: 13, flex: "1 1 160px" }}
                />
              )}
              <input
                placeholder="Series"
                value={newExercise.sets}
                onChange={(ev) => setNewExercise({ ...newExercise, sets: ev.target.value })}
                style={{ width: 60, background: COLORS.surface2, color: COLORS.text, border: `1px solid ${COLORS.border}`, borderRadius: 6, padding: "6px 8px", fontFamily: "Inter", fontSize: 13 }}
              />
              <input
                placeholder="Reps"
                value={newExercise.reps}
                onChange={(ev) => setNewExercise({ ...newExercise, reps: ev.target.value })}
                style={{ width: 70, background: COLORS.surface2, color: COLORS.text, border: `1px solid ${COLORS.border}`, borderRadius: 6, padding: "6px 8px", fontFamily: "Inter", fontSize: 13 }}
              />
              <input
                placeholder="Peso objetivo"
                value={newExercise.targetWeight}
                onChange={(ev) => setNewExercise({ ...newExercise, targetWeight: ev.target.value })}
                style={{ width: 100, background: COLORS.surface2, color: COLORS.text, border: `1px solid ${COLORS.border}`, borderRadius: 6, padding: "6px 8px", fontFamily: "Inter", fontSize: 13 }}
              />
              <input
                placeholder="Descanso series (s)"
                value={newExercise.restSets}
                onChange={(ev) => setNewExercise({ ...newExercise, restSets: ev.target.value })}
                style={{ width: 130, background: COLORS.surface2, color: COLORS.text, border: `1px solid ${COLORS.border}`, borderRadius: 6, padding: "6px 8px", fontFamily: "Inter", fontSize: 13 }}
              />
              <input
                placeholder="Descanso post (s)"
                value={newExercise.restAfter}
                onChange={(ev) => setNewExercise({ ...newExercise, restAfter: ev.target.value })}
                style={{ width: 130, background: COLORS.surface2, color: COLORS.text, border: `1px solid ${COLORS.border}`, borderRadius: 6, padding: "6px 8px", fontFamily: "Inter", fontSize: 13 }}
              />
              <button
                onClick={addExercise}
                className="flex items-center gap-1 px-3 py-1.5 rounded-md"
                style={{ background: COLORS.accent, color: "#101215", fontFamily: "Inter", fontSize: 13, fontWeight: 600 }}
              >
                <Plus size={14} /> Agregar
              </button>
            </div>
          </div>

          <div style={{ background: COLORS.surface, border: `1px dashed ${COLORS.border}`, borderRadius: 10, padding: 16 }}>
            <div style={{ fontFamily: "Inter", fontSize: 13, color: COLORS.dim, marginBottom: 10 }}>Agregar día de entrenamiento</div>
            <div className="flex flex-wrap gap-2">
              <input
                placeholder="Nombre del día (ej: Miércoles)"
                value={newDay.nombre}
                onChange={(ev) => setNewDay({ ...newDay, nombre: ev.target.value })}
                style={{ width: 200, background: COLORS.surface2, color: COLORS.text, border: `1px solid ${COLORS.border}`, borderRadius: 6, padding: "6px 8px", fontFamily: "Inter", fontSize: 13 }}
              />
              <input
                placeholder="Foco (ej: Espalda / Bíceps)"
                value={newDay.foco}
                onChange={(ev) => setNewDay({ ...newDay, foco: ev.target.value })}
                style={{ width: 220, background: COLORS.surface2, color: COLORS.text, border: `1px solid ${COLORS.border}`, borderRadius: 6, padding: "6px 8px", fontFamily: "Inter", fontSize: 13 }}
              />
              <button
                onClick={crearDia}
                disabled={creandoDia}
                className="flex items-center gap-1 px-3 py-1.5 rounded-md"
                style={{ background: COLORS.accent, color: "#101215", fontFamily: "Inter", fontSize: 13, fontWeight: 600, opacity: creandoDia ? 0.6 : 1 }}
              >
                <Plus size={14} /> {creandoDia ? "Creando..." : "Agregar día"}
              </button>
            </div>
          </div>
        </div>
        </>
        )}
        </>
        )}
      </div>
    </div>
      )}
    </div>
  );
}

const CONSEJOS_DEL_DIA = [
  "El descanso entre series también es parte del entrenamiento — respetalo.",
  "La progresión de cargas rinde más que entrenar al fallo todo el tiempo.",
  "Dormir bien es tan importante para tus resultados como la sesión en sí.",
  "La técnica correcta rinde más que el peso levantado.",
  "Hidratarte antes, durante y después del entrenamiento mejora tu rendimiento.",
  "Un buen calentamiento reduce el riesgo de lesiones.",
  "La constancia le gana a la intensidad ocasional.",
  "Registrar tus series te ayuda a ver tu progreso real, más allá de cómo te sentiste ese día.",
  "Variar los ejercicios cada tanto ayuda a evitar estancamientos.",
  "Escuchar a tu cuerpo es tan importante como seguir el plan al pie de la letra.",
  "La alimentación acompaña al entrenamiento, no lo reemplaza.",
  "Cada sesión completada suma, aunque no la sientas perfecta.",
];

function consejoDeHoy() {
  const inicioAnio = new Date(new Date().getFullYear(), 0, 0);
  const diff = new Date() - inicioAnio;
  const diaDelAnio = Math.floor(diff / (1000 * 60 * 60 * 24));
  return CONSEJOS_DEL_DIA[diaDelAnio % CONSEJOS_DEL_DIA.length];
}

function saludoSegunHora() {
  const h = new Date().getHours();
  if (h < 12) return "Buenos días";
  if (h < 19) return "Buenas tardes";
  return "Buenas noches";
}

function InicioAlumno({ alumno }) {
  const [historialSesiones, setHistorialSesiones] = useState([]);
  const [historialRM, setHistorialRM] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    setCargando(true);
    Promise.all([api.fetchHistorialSesiones(alumno.id), api.fetchHistorialRM(alumno.id)])
      .then(([sesiones, rm]) => {
        setHistorialSesiones(sesiones);
        setHistorialRM(rm);
      })
      .catch(() => {})
      .finally(() => setCargando(false));
  }, [alumno.id]);

  const inicioSemana = (() => {
    const hoy = new Date();
    const diaSemana = hoy.getDay() === 0 ? 7 : hoy.getDay(); // lunes = 1 ... domingo = 7
    const lunes = new Date(hoy);
    lunes.setDate(hoy.getDate() - (diaSemana - 1));
    lunes.setHours(0, 0, 0, 0);
    return lunes;
  })();

  const diasEstaSemana = historialSesiones.filter((s) => new Date(s.fecha + "T00:00:00") >= inicioSemana).length;
  const ultimaRM = historialRM.length > 0 ? historialRM[historialRM.length - 1] : null;
  const totalSesiones = historialSesiones.length;

  return (
    <div style={{ maxWidth: 640, margin: "0 auto" }}>
      <div
        className="flex items-center gap-4 mb-6 p-5 rounded-2xl"
        style={{ background: `linear-gradient(135deg, ${COLORS.surface} 0%, ${COLORS.surface2} 100%)`, border: `1px solid ${COLORS.border}` }}
      >
        <img src={LOGO_ICON} alt="Fitnourish" style={{ height: 44, width: "auto" }} />
        <div>
          <div style={{ fontFamily: "Bebas Neue", fontSize: 26, letterSpacing: 1, color: COLORS.text, lineHeight: 1 }}>
            {saludoSegunHora()}, {alumno.name.split(" ")[0]}
          </div>
          <div style={{ fontFamily: "Inter", fontSize: 12, color: COLORS.accent, marginTop: 6 }}>
            💡 {consejoDeHoy()}
          </div>
        </div>
      </div>

      {cargando ? (
        <span style={{ fontFamily: "Inter", fontSize: 13, color: COLORS.dim }}>Cargando tus datos...</span>
      ) : (
        <div className="grid grid-cols-3 gap-3">
          <div style={{ background: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: 12, padding: 16 }}>
            <div style={{ fontFamily: "Bebas Neue", fontSize: 30, color: COLORS.accent }}>{diasEstaSemana}</div>
            <div style={{ fontFamily: "Inter", fontSize: 11, color: COLORS.dim, marginTop: 4 }}>Días entrenados esta semana</div>
          </div>
          <div style={{ background: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: 12, padding: 16 }}>
            <div style={{ fontFamily: "Bebas Neue", fontSize: 30, color: COLORS.accent }}>{totalSesiones}</div>
            <div style={{ fontFamily: "Inter", fontSize: 11, color: COLORS.dim, marginTop: 4 }}>Sesiones registradas en total</div>
          </div>
          <div style={{ background: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: 12, padding: 16 }}>
            {ultimaRM ? (
              <>
                <div style={{ fontFamily: "Bebas Neue", fontSize: 30, color: COLORS.accent }}>{parseFloat(ultimaRM.rm_estimado).toFixed(0)} kg</div>
                <div style={{ fontFamily: "Inter", fontSize: 11, color: COLORS.dim, marginTop: 4 }}>Última RM · {ultimaRM.ejercicios?.nombre}</div>
              </>
            ) : (
              <>
                <div style={{ fontFamily: "Bebas Neue", fontSize: 30, color: COLORS.dim }}>—</div>
                <div style={{ fontFamily: "Inter", fontSize: 11, color: COLORS.dim, marginTop: 4 }}>Todavía sin RM guardada</div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function ProgresoView({ alumnoId }) {
  const [historialRM, setHistorialRM] = useState([]);
  const [historialSesiones, setHistorialSesiones] = useState([]);
  const [ejercicioSeleccionado, setEjercicioSeleccionado] = useState("");
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    setCargando(true);
    Promise.all([api.fetchHistorialRM(alumnoId), api.fetchHistorialSesiones(alumnoId)])
      .then(([rm, sesiones]) => {
        setHistorialRM(rm);
        setHistorialSesiones(sesiones);
      })
      .catch(() => {})
      .finally(() => setCargando(false));
  }, [alumnoId]);

  const ejerciciosConRM = [];
  historialRM.forEach((r) => {
    if (!ejerciciosConRM.find((e) => e.id === r.ejercicio_id)) {
      ejerciciosConRM.push({ id: r.ejercicio_id, nombre: r.ejercicios?.nombre || "Ejercicio" });
    }
  });

  useEffect(() => {
    if (ejerciciosConRM.length > 0 && !ejercicioSeleccionado) {
      setEjercicioSeleccionado(ejerciciosConRM[0].id);
    }
  }, [historialRM]);

  const formatFecha = (f) => new Date(f).toLocaleDateString("es-AR", { day: "2-digit", month: "2-digit" });

  const datosRM = historialRM
    .filter((r) => r.ejercicio_id === ejercicioSeleccionado)
    .map((r) => ({ fecha: formatFecha(r.fecha), rm: parseFloat(r.rm_estimado) }));

  const datosDuracion = historialSesiones
    .filter((s) => s.duracion_segundos)
    .map((s) => ({ fecha: formatFecha(s.fecha), minutos: Math.round(s.duracion_segundos / 60) }));

  const datosBorg = historialSesiones
    .filter((s) => s.esfuerzo_percibido_borg !== null)
    .map((s) => ({ fecha: formatFecha(s.fecha), borg: s.esfuerzo_percibido_borg }));

  const tooltipStyle = { background: COLORS.surface2, border: `1px solid ${COLORS.border}`, borderRadius: 6, fontFamily: "Inter", fontSize: 12, color: COLORS.text };

  if (cargando) {
    return <span style={{ fontFamily: "Inter", fontSize: 13, color: COLORS.dim }}>Cargando progreso...</span>;
  }

  return (
    <div className="flex flex-col gap-6" style={{ maxWidth: 640 }}>
      <div style={{ background: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: 10, padding: 16 }}>
        <div className="flex items-center justify-between mb-3">
          <span style={{ fontFamily: "Bebas Neue", fontSize: 18, letterSpacing: 1, color: COLORS.accent }}>RM a lo largo del tiempo</span>
          {ejerciciosConRM.length > 0 && (
            <select
              value={ejercicioSeleccionado}
              onChange={(ev) => setEjercicioSeleccionado(ev.target.value)}
              style={{ background: COLORS.surface2, color: COLORS.text, border: `1px solid ${COLORS.border}`, borderRadius: 6, padding: "5px 8px", fontFamily: "Inter", fontSize: 12 }}
            >
              {ejerciciosConRM.map((e) => (
                <option key={e.id} value={e.id}>{e.nombre}</option>
              ))}
            </select>
          )}
        </div>
        {ejerciciosConRM.length === 0 ? (
          <span style={{ fontFamily: "Inter", fontSize: 12, color: COLORS.dim }}>Todavía no hay cálculos de RM guardados.</span>
        ) : datosRM.length < 2 ? (
          <span style={{ fontFamily: "Inter", fontSize: 12, color: COLORS.dim }}>Necesitás al menos 2 cálculos de este ejercicio en distintas fechas para ver la evolución.</span>
        ) : (
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={datosRM}>
              <CartesianGrid stroke={COLORS.border} strokeDasharray="3 3" />
              <XAxis dataKey="fecha" stroke={COLORS.dim} fontSize={11} />
              <YAxis stroke={COLORS.dim} fontSize={11} />
              <Tooltip contentStyle={tooltipStyle} />
              <Line type="monotone" dataKey="rm" name="RM (kg)" stroke={COLORS.accent} strokeWidth={2} dot={{ fill: COLORS.accent, r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>

      <div style={{ background: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: 10, padding: 16 }}>
        <div style={{ fontFamily: "Bebas Neue", fontSize: 18, letterSpacing: 1, color: COLORS.accent, marginBottom: 12 }}>Duración de las sesiones</div>
        {datosDuracion.length < 2 ? (
          <span style={{ fontFamily: "Inter", fontSize: 12, color: COLORS.dim }}>Todavía no hay suficientes sesiones con cronómetro guardado.</span>
        ) : (
          <ResponsiveContainer width="100%" height={180}>
            <LineChart data={datosDuracion}>
              <CartesianGrid stroke={COLORS.border} strokeDasharray="3 3" />
              <XAxis dataKey="fecha" stroke={COLORS.dim} fontSize={11} />
              <YAxis stroke={COLORS.dim} fontSize={11} />
              <Tooltip contentStyle={tooltipStyle} />
              <Line type="monotone" dataKey="minutos" name="Minutos" stroke={COLORS.accentDim} strokeWidth={2} dot={{ fill: COLORS.accentDim, r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>

      <div style={{ background: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: 10, padding: 16 }}>
        <div style={{ fontFamily: "Bebas Neue", fontSize: 18, letterSpacing: 1, color: COLORS.accent, marginBottom: 12 }}>Esfuerzo percibido (Borg)</div>
        {datosBorg.length < 2 ? (
          <span style={{ fontFamily: "Inter", fontSize: 12, color: COLORS.dim }}>Todavía no hay suficientes sesiones con esfuerzo percibido guardado.</span>
        ) : (
          <ResponsiveContainer width="100%" height={180}>
            <LineChart data={datosBorg}>
              <CartesianGrid stroke={COLORS.border} strokeDasharray="3 3" />
              <XAxis dataKey="fecha" stroke={COLORS.dim} fontSize={11} />
              <YAxis domain={[6, 20]} stroke={COLORS.dim} fontSize={11} />
              <Tooltip contentStyle={tooltipStyle} />
              <Line type="monotone" dataKey="borg" name="Borg" stroke={COLORS.danger} strokeWidth={2} dot={{ fill: COLORS.danger, r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}

function RMCalculator({ alumno }) {
  const allExercises = [];
  alumno.days.forEach((d) =>
    d.exercises.forEach((e) => {
      if (e.catalogId && !allExercises.find((x) => x.catalogId === e.catalogId)) {
        allExercises.push({ catalogId: e.catalogId, name: e.name });
      }
    })
  );

  const [selected, setSelected] = useState(allExercises[0]?.catalogId || "");
  const [weight, setWeight] = useState("");
  const [reps, setReps] = useState("");
  const [guardado, setGuardado] = useState(false);
  const [guardando, setGuardando] = useState(false);

  const w = parseFloat(weight);
  const r = parseInt(reps, 10);
  const valid = w > 0 && r > 0 && r <= 20;
  const rm = valid ? w * (1 + r / 30) : null;
  const percentages = [100, 90, 85, 80, 75, 70, 65, 60];
  const selectedName = allExercises.find((x) => x.catalogId === selected)?.name || "";

  const guardarRM = async () => {
    if (!rm || !selected) return;
    setGuardando(true);
    try {
      await api.guardarRM({
        alumnoId: alumno.id,
        ejercicioId: selected,
        pesoUsado: weight,
        repsUsadas: r,
        rmEstimado: rm.toFixed(1),
      });
      setGuardado(true);
    } catch (err) {
      alert("No se pudo guardar la RM: " + err.message);
    } finally {
      setGuardando(false);
    }
  };

  return (
    <div style={{ maxWidth: 480, margin: "0 auto" }}>
      <div className="flex items-center gap-2 mb-1">
        <Calculator size={20} color={COLORS.accent} />
        <span style={{ fontFamily: "Bebas Neue", fontSize: 30, letterSpacing: 1, color: COLORS.text }}>Calculadora de RM</span>
      </div>
      <div style={{ fontFamily: "Inter", fontSize: 13, color: COLORS.dim, marginBottom: 20 }}>
        Elegí un ejercicio y cargá un peso y reps que hayas hecho recientemente para estimar tu repetición máxima.
      </div>

      <div style={{ background: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: 10, padding: 16 }}>
        <div className="flex flex-col gap-3">
          <div>
            <label style={{ fontFamily: "Inter", fontSize: 12, color: COLORS.dim, display: "block", marginBottom: 6 }}>Ejercicio</label>
            <select
              value={selected}
              onChange={(ev) => { setSelected(ev.target.value); setGuardado(false); }}
              style={{ width: "100%", background: COLORS.surface2, color: COLORS.text, border: `1px solid ${COLORS.border}`, borderRadius: 6, padding: "8px 10px", fontFamily: "Inter", fontSize: 14 }}
            >
              {allExercises.map((ex) => (
                <option key={ex.catalogId} value={ex.catalogId}>{ex.name}</option>
              ))}
            </select>
          </div>
          <div className="flex gap-3">
            <div className="flex-1">
              <label style={{ fontFamily: "Inter", fontSize: 12, color: COLORS.dim, display: "block", marginBottom: 6 }}>Peso levantado (kg)</label>
              <input
                value={weight}
                onChange={(ev) => setWeight(ev.target.value)}
                placeholder="Ej: 60"
                style={{ width: "100%", background: COLORS.surface2, color: COLORS.text, border: `1px solid ${COLORS.border}`, borderRadius: 6, padding: "8px 10px", fontFamily: "JetBrains Mono", fontSize: 14, boxSizing: "border-box" }}
              />
            </div>
            <div className="flex-1">
              <label style={{ fontFamily: "Inter", fontSize: 12, color: COLORS.dim, display: "block", marginBottom: 6 }}>Repeticiones</label>
              <input
                value={reps}
                onChange={(ev) => setReps(ev.target.value)}
                placeholder="Ej: 6"
                style={{ width: "100%", background: COLORS.surface2, color: COLORS.text, border: `1px solid ${COLORS.border}`, borderRadius: 6, padding: "8px 10px", fontFamily: "JetBrains Mono", fontSize: 14, boxSizing: "border-box" }}
              />
            </div>
          </div>
        </div>

        {rm ? (
          <div className="mt-5">
            <div className="flex items-baseline gap-2" style={{ borderTop: `1px solid ${COLORS.border}`, paddingTop: 16 }}>
              <span style={{ fontFamily: "Bebas Neue", fontSize: 44, color: COLORS.accent, letterSpacing: 1 }}>{rm.toFixed(1)} kg</span>
              <span style={{ fontFamily: "Inter", fontSize: 12, color: COLORS.dim }}>RM estimada en {selectedName}</span>
            </div>
            <div className="grid grid-cols-4 gap-2 mt-4">
              {percentages.map((p) => (
                <div key={p} className="rounded-md px-2 py-2 text-center" style={{ background: COLORS.surface2 }}>
                  <div style={{ fontFamily: "JetBrains Mono", fontSize: 13, color: COLORS.text }}>{((rm * p) / 100).toFixed(1)}</div>
                  <div style={{ fontFamily: "Inter", fontSize: 10, color: COLORS.dim, marginTop: 2 }}>{p}%</div>
                </div>
              ))}
            </div>
            <button
              onClick={guardarRM}
              disabled={guardando || guardado}
              className="mt-4 px-3 py-2 rounded-md"
              style={{
                background: guardado ? COLORS.surface2 : COLORS.accent,
                color: guardado ? COLORS.dim : "#101215",
                fontFamily: "Inter", fontSize: 13, fontWeight: 600, opacity: guardando ? 0.6 : 1,
              }}
            >
              {guardado ? "Guardado en tu historial ✓" : guardando ? "Guardando..." : "Guardar en mi historial"}
            </button>
            <div style={{ fontFamily: "Inter", fontSize: 11, color: COLORS.dim, marginTop: 10 }}>
              Estimación con fórmula de Epley. Es orientativa, no reemplaza un test real de 1RM.
            </div>
          </div>
        ) : (
          <div style={{ fontFamily: "Inter", fontSize: 12, color: COLORS.dim, marginTop: 16, borderTop: `1px solid ${COLORS.border}`, paddingTop: 16 }}>
            Cargá un peso y reps (hasta 20) para ver tu RM estimada.
          </div>
        )}
      </div>
    </div>
  );
}

function BorgScale({ value, onChange }) {
  const v = value ?? 12;
  const color = borgColor(v);
  return (
    <div style={{ background: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: 10, padding: 16 }}>
      <div className="flex items-center gap-2 mb-1">
        <Flame size={16} color={COLORS.accent} />
        <span style={{ fontFamily: "Bebas Neue", fontSize: 18, letterSpacing: 1, color: COLORS.text }}>Esfuerzo percibido</span>
        <span style={{ fontFamily: "Inter", fontSize: 11, color: COLORS.dim }}>escala de Borg (6-20)</span>
      </div>
      <div style={{ fontFamily: "Inter", fontSize: 12, color: COLORS.dim, marginBottom: 14 }}>
        ¿Qué tan dura sentiste la sesión de hoy en general?
      </div>
      <div className="flex items-center gap-3">
        <input
          type="range"
          min={6}
          max={20}
          value={v}
          onChange={(ev) => onChange(Number(ev.target.value))}
          style={{ flex: 1, accentColor: color }}
        />
        <span
          className="flex items-center justify-center"
          style={{
            width: 36, height: 36, borderRadius: 8,
            background: `${color}22`, border: `1px solid ${color}`,
            fontFamily: "JetBrains Mono", fontSize: 16, fontWeight: 700, color,
          }}
        >
          {v}
        </span>
      </div>
      <div style={{ fontFamily: "Inter", fontSize: 13, color, marginTop: 8, fontWeight: 600 }}>
        {borgLabel(v)}
      </div>
      {value === null && (
        <div style={{ fontFamily: "Inter", fontSize: 11, color: COLORS.dim, marginTop: 6 }}>
          Movete la barra para registrar tu esfuerzo de hoy.
        </div>
      )}
    </div>
  );
}

function SessionStopwatch({ elapsed, running, onStart, onPause, onReset }) {
  return (
    <div className="flex items-center gap-2 px-3 py-2 rounded-md" style={{ background: COLORS.surface, border: `1px solid ${COLORS.border}` }}>
      <span style={{ fontFamily: "JetBrains Mono", fontSize: 16, color: COLORS.text, minWidth: 56 }}>{formatTime(elapsed)}</span>
      {running ? (
        <button onClick={onPause} className="flex items-center gap-1 px-2.5 py-1.5 rounded-md" style={{ background: COLORS.surface2, color: COLORS.text }}>
          <Pause size={13} />
        </button>
      ) : (
        <button onClick={onStart} className="flex items-center gap-1 px-2.5 py-1.5 rounded-md" style={{ background: COLORS.accent, color: "#101215" }}>
          <Play size={13} />
        </button>
      )}
      <button onClick={onReset} className="flex items-center gap-1 px-2.5 py-1.5 rounded-md" style={{ background: COLORS.surface2, color: COLORS.dim }}>
        <RotateCcw size={13} />
      </button>
      <span style={{ fontFamily: "Inter", fontSize: 11, color: COLORS.dim }}>duración de la sesión</span>
    </div>
  );
}

function AlumnoView({ alumno, setAlumnos }) {
  const [section, setSection] = useState("inicio");
  const [dayIdx, setDayIdx] = useState(0);
  const [restTimer, setRestTimer] = useState(null);
  const [sessionTimer, setSessionTimer] = useState({ running: false, elapsed: 0 });
  const [programadoHoy, setProgramadoHoy] = useState(undefined); // undefined = todavía no se sabe

  const sinDias = !alumno.days || alumno.days.length === 0;
  const day = sinDias ? { exercises: [], dayId: null, rpeBorg: null } : alumno.days[dayIdx];
  const pct = Math.round((day.exercises.filter((e) => e.done).length / (day.exercises.length || 1)) * 100) || 0;

  useEffect(() => {
    if (sinDias) return;
    const hoy = new Date().toISOString().slice(0, 10);
    api
      .fetchProgramacionParaFecha({ alumnoId: alumno.id, fecha: hoy })
      .then((prog) => {
        setProgramadoHoy(prog || null);
        if (prog) {
          const idx = alumno.days.findIndex((d) => d.dayId === prog.dia_id);
          if (idx !== -1) setDayIdx(idx);
        }
      })
      .catch(() => setProgramadoHoy(null));
  }, [alumno.id]);

  useEffect(() => {
    if (!restTimer || restTimer.secondsLeft <= 0) return;
    const t = setTimeout(() => setRestTimer((prev) => (prev ? { ...prev, secondsLeft: prev.secondsLeft - 1 } : prev)), 1000);
    return () => clearTimeout(t);
  }, [restTimer]);

  useEffect(() => {
    if (!sessionTimer.running) return;
    const t = setTimeout(() => setSessionTimer((prev) => ({ ...prev, elapsed: prev.elapsed + 1 })), 1000);
    return () => clearTimeout(t);
  }, [sessionTimer]);

  const startRest = (exId, seconds) => setRestTimer({ exId, secondsLeft: seconds, total: seconds });

  const pausarCronometro = () => {
    setSessionTimer((p) => ({ ...p, running: false }));
    api.guardarDuracionSesion({ dayId: day.dayId, alumnoId: alumno.id, segundos: sessionTimer.elapsed }).catch((err) =>
      alert("No se pudo guardar la duración: " + err.message)
    );
  };

  const setBorg = (value) => {
    setAlumnos((prev) =>
      prev.map((a) => {
        if (a.id !== alumno.id) return a;
        const days = a.days.map((d, idx) => (idx === dayIdx ? { ...d, rpeBorg: value } : d));
        return { ...a, days };
      })
    );
    api.guardarBorg({ dayId: day.dayId, alumnoId: alumno.id, valor: value }).catch((err) =>
      alert("No se pudo guardar el esfuerzo percibido: " + err.message)
    );
  };

  const toggleDone = (exId) => {
    const actual = day.exercises.find((e) => e.id === exId)?.done;
    setAlumnos((prev) =>
      prev.map((a) => {
        if (a.id !== alumno.id) return a;
        const days = a.days.map((d, idx) =>
          idx === dayIdx
            ? { ...d, exercises: d.exercises.map((e) => (e.id === exId ? { ...e, done: !e.done } : e)) }
            : d
        );
        return { ...a, days };
      })
    );
    api
      .marcarEjercicio({ dayId: day.dayId, alumnoId: alumno.id, diaEjercicioId: exId, hecho: !actual })
      .catch((err) => alert("No se pudo guardar: " + err.message));
  };

  const updateLog = (exId, field, value) => {
    setAlumnos((prev) =>
      prev.map((a) => {
        if (a.id !== alumno.id) return a;
        const days = a.days.map((d, idx) =>
          idx === dayIdx
            ? { ...d, exercises: d.exercises.map((e) => (e.id === exId ? { ...e, [field]: value } : e)) }
            : d
        );
        return { ...a, days };
      })
    );
  };

  const guardarLogEnBlur = (exId) => {
    const ex = day.exercises.find((e) => e.id === exId);
    if (!ex) return;
    api
      .guardarLog({ dayId: day.dayId, alumnoId: alumno.id, diaEjercicioId: exId, pesoLogrado: ex.logWeight, repsLogradas: ex.logReps })
      .catch((err) => alert("No se pudo guardar el registro: " + err.message));
  };

  const toggleComments = (exId) => {
    setAlumnos((prev) =>
      prev.map((a) => {
        if (a.id !== alumno.id) return a;
        const days = a.days.map((d, idx) =>
          idx === dayIdx
            ? { ...d, exercises: d.exercises.map((e) => (e.id === exId ? { ...e, showComments: !e.showComments } : e)) }
            : d
        );
        return { ...a, days };
      })
    );
  };

  const addComment = async (exId, comment) => {
    try {
      const guardado = await api.agregarComentario({ diaEjercicioId: exId, autorId: alumno.id, texto: comment.text });
      const comentarioReal = { id: guardado.id, author: "alumno", authorName: alumno.name.split(" ")[0], text: comment.text };
      setAlumnos((prev) =>
        prev.map((a) => {
          if (a.id !== alumno.id) return a;
          const days = a.days.map((d, idx) =>
            idx === dayIdx
              ? { ...d, exercises: d.exercises.map((e) => (e.id === exId ? { ...e, comments: [...e.comments, comentarioReal] } : e)) }
              : d
          );
          return { ...a, days };
        })
      );
    } catch (err) {
      alert("No se pudo guardar el comentario: " + err.message);
    }
  };

  if (sinDias) {
    return (
      <div style={{ fontFamily: "Inter", fontSize: 13, color: COLORS.dim, textAlign: "center", padding: "40px 0" }}>
        Todavía no tenés ningún día de entrenamiento cargado. Avisale a tu profesor.
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 640, margin: "0 auto" }}>
      <div className="flex gap-1 p-1 rounded-full mb-6" style={{ background: COLORS.surface, width: "fit-content" }}>
        <button
          onClick={() => setSection("inicio")}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full"
          style={{
            fontFamily: "Inter", fontSize: 13, fontWeight: 600,
            background: section === "inicio" ? COLORS.accent : "transparent",
            color: section === "inicio" ? "#101215" : COLORS.dim,
          }}
        >
          <Home size={14} /> Inicio
        </button>
        <button
          onClick={() => setSection("sesion")}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full"
          style={{
            fontFamily: "Inter", fontSize: 13, fontWeight: 600,
            background: section === "sesion" ? COLORS.accent : "transparent",
            color: section === "sesion" ? "#101215" : COLORS.dim,
          }}
        >
          <Flame size={14} /> Sesión
        </button>
        <button
          onClick={() => setSection("rm")}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full"
          style={{
            fontFamily: "Inter", fontSize: 13, fontWeight: 600,
            background: section === "rm" ? COLORS.accent : "transparent",
            color: section === "rm" ? "#101215" : COLORS.dim,
          }}
        >
          <Calculator size={14} /> Calcular RM
        </button>
        <button
          onClick={() => setSection("progreso")}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full"
          style={{
            fontFamily: "Inter", fontSize: 13, fontWeight: 600,
            background: section === "progreso" ? COLORS.accent : "transparent",
            color: section === "progreso" ? "#101215" : COLORS.dim,
          }}
        >
          <TrendingUp size={14} /> Progreso
        </button>
        <button
          onClick={() => setSection("calendario")}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full"
          style={{
            fontFamily: "Inter", fontSize: 13, fontWeight: 600,
            background: section === "calendario" ? COLORS.accent : "transparent",
            color: section === "calendario" ? "#101215" : COLORS.dim,
          }}
        >
          <CalendarDays size={14} /> Calendario
        </button>
      </div>

      {section === "inicio" ? (
        <InicioAlumno alumno={alumno} />
      ) : section === "rm" ? (
        <RMCalculator alumno={alumno} />
      ) : section === "progreso" ? (
        <ProgresoView alumnoId={alumno.id} />
      ) : section === "calendario" ? (
        <CalendarioAlumno alumno={alumno} />
      ) : (
      <>
      <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
        <div className="flex gap-2">
          {alumno.days.map((d, idx) => (
            <button
              key={d.day}
              onClick={() => { setDayIdx(idx); setRestTimer(null); }}
              className="px-3 py-1.5 rounded-full"
              style={{
                fontFamily: "Inter",
                fontSize: 13,
                fontWeight: 600,
                background: idx === dayIdx ? COLORS.accent : COLORS.surface2,
                color: idx === dayIdx ? "#101215" : COLORS.dim,
              }}
            >
              {d.day}
            </button>
          ))}
        </div>
        <SessionStopwatch
          elapsed={sessionTimer.elapsed}
          running={sessionTimer.running}
          onStart={() => setSessionTimer((p) => ({ ...p, running: true }))}
          onPause={pausarCronometro}
          onReset={() => setSessionTimer({ running: false, elapsed: 0 })}
        />
      </div>

      {programadoHoy === null && (
        <div className="flex items-center justify-between gap-3 mb-4 px-3 py-2 rounded-md" style={{ background: "rgba(226,74,59,0.1)", border: `1px solid ${COLORS.danger}` }}>
          <span style={{ fontFamily: "Inter", fontSize: 12, color: COLORS.text }}>
            No tenés nada programado para hoy. Si te faltó algún día, buscalo en el calendario.
          </span>
          <button
            onClick={() => setSection("calendario")}
            className="flex items-center gap-1 px-2.5 py-1 rounded-md shrink-0"
            style={{ background: COLORS.danger, color: "#101215", fontFamily: "Inter", fontSize: 12, fontWeight: 600 }}
          >
            <CalendarDays size={12} /> Ver calendario
          </button>
        </div>
      )}

      <div style={{ fontFamily: "Bebas Neue", fontSize: 34, letterSpacing: 1, color: COLORS.text, lineHeight: 1 }}>{day.focus}</div>
      <div style={{ fontFamily: "Inter", fontSize: 13, color: COLORS.dim, marginTop: 4, marginBottom: 16 }}>
        {day.exercises.length} ejercicios · sesión de hoy
      </div>

      <div style={{ marginBottom: 20 }}>
        <BarbellProgress pct={pct} />
      </div>

      <div className="flex flex-col gap-3">
        {day.exercises.map((e) => (
          <div
            key={e.id}
            style={{
              background: COLORS.surface,
              border: `1px solid ${e.done ? COLORS.accentDim : COLORS.border}`,
              borderRadius: 10,
              padding: 14,
              opacity: e.done ? 0.75 : 1,
              transition: "all 200ms ease",
            }}
          >
            <div className="flex items-center justify-between">
              <div>
                <div style={{ fontFamily: "Inter", fontSize: 15, fontWeight: 600, color: COLORS.text }}>{e.name}</div>
                <div style={{ fontFamily: "JetBrains Mono", fontSize: 12, color: COLORS.dim, marginTop: 2 }}>
                  Objetivo: {e.sets}×{e.reps} · {e.targetWeight}
                </div>
              </div>
              <button
                onClick={() => toggleDone(e.id)}
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 8,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: e.done ? COLORS.accent : "transparent",
                  border: `1px solid ${e.done ? COLORS.accent : COLORS.border}`,
                  color: e.done ? "#101215" : COLORS.dim,
                }}
              >
                <Check size={16} />
              </button>
            </div>

            <div className="mt-2">
              <MediaBox url={e.mediaUrl} />
            </div>

            <div className="flex gap-2 mt-3 flex-wrap items-center">
              <input
                placeholder="kg"
                value={e.logWeight}
                onChange={(ev) => updateLog(e.id, "logWeight", ev.target.value)}
                onBlur={() => guardarLogEnBlur(e.id)}
                style={{ width: 70, background: COLORS.surface2, color: COLORS.text, border: `1px solid ${COLORS.border}`, borderRadius: 6, padding: "6px 8px", fontFamily: "JetBrains Mono", fontSize: 13 }}
              />
              <input
                placeholder="reps"
                value={e.logReps}
                onChange={(ev) => updateLog(e.id, "logReps", ev.target.value)}
                onBlur={() => guardarLogEnBlur(e.id)}
                style={{ width: 70, background: COLORS.surface2, color: COLORS.text, border: `1px solid ${COLORS.border}`, borderRadius: 6, padding: "6px 8px", fontFamily: "JetBrains Mono", fontSize: 13 }}
              />
              <span style={{ fontFamily: "Inter", fontSize: 12, color: COLORS.dim }}>registrado</span>

              <div className="flex items-center gap-1 ml-auto">
                {restTimer && restTimer.exId === e.id ? (
                  <span
                    className="flex items-center gap-1 px-2.5 py-1.5 rounded-md"
                    style={{ background: "rgba(91,155,199,0.12)", border: `1px solid ${COLORS.accent}`, fontFamily: "JetBrains Mono", fontSize: 13, color: COLORS.accent }}
                  >
                    <Clock size={13} /> {formatTime(restTimer.secondsLeft)}
                  </span>
                ) : (
                  <>
                    <button
                      onClick={() => startRest(e.id, e.restSets)}
                      className="flex items-center gap-1 px-2.5 py-1.5 rounded-md"
                      style={{ background: COLORS.surface2, border: `1px solid ${COLORS.border}`, fontFamily: "Inter", fontSize: 12, color: COLORS.dim }}
                    >
                      <Clock size={12} /> Descanso {e.restSets}s
                    </button>
                    <button
                      onClick={() => startRest(e.id, e.restAfter)}
                      className="flex items-center gap-1 px-2.5 py-1.5 rounded-md"
                      style={{ background: COLORS.surface2, border: `1px solid ${COLORS.border}`, fontFamily: "Inter", fontSize: 12, color: COLORS.dim }}
                    >
                      <Clock size={12} /> Post {e.restAfter}s
                    </button>
                  </>
                )}
              </div>
            </div>

            <button
              onClick={() => toggleComments(e.id)}
              className="flex items-center gap-1.5 mt-3"
              style={{ color: e.comments.length ? COLORS.accent : COLORS.dim, fontFamily: "Inter", fontSize: 12 }}
            >
              <MessageSquare size={13} />
              {e.comments.length > 0 ? `${e.comments.length} comentario${e.comments.length > 1 ? "s" : ""}` : "Dejar feedback"}
            </button>

            {e.showComments && (
              <CommentsPanel exercise={e} onAddComment={addComment} currentAuthor="alumno" currentAuthorName={alumno.name.split(" ")[0]} />
            )}
          </div>
        ))}
      </div>

      {pct === 100 && (
        <div className="flex items-center gap-2 mt-5 px-3 py-2 rounded-md" style={{ background: "rgba(226,74,59,0.12)", border: `1px solid ${COLORS.danger}` }}>
          <Flame size={16} color={COLORS.danger} />
          <span style={{ fontFamily: "Inter", fontSize: 13, color: COLORS.text }}>Sesión completa. Buen laburo.</span>
        </div>
      )}

      <div className="mt-5">
        <BorgScale value={day.rpeBorg} onChange={setBorg} />
      </div>
      </>
      )}
    </div>
  );
}

export default function App() {
  const [session, setSession] = useState(undefined); // undefined = todavía no sabemos
  const [usuario, setUsuario] = useState(null);
  const [cargandoPerfil, setCargandoPerfil] = useState(false);
  const [alumnos, setAlumnos] = useState([]);
  const [cargandoDatos, setCargandoDatos] = useState(false);
  const [errorDatos, setErrorDatos] = useState("");

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session));
    const { data: listener } = supabase.auth.onAuthStateChange((_event, s) => setSession(s));
    return () => listener.subscription.unsubscribe();
  }, []);

  const usuarioIdCargado = useRef(null);

  useEffect(() => {
    if (session === undefined) return;
    if (!session) { setUsuario(null); usuarioIdCargado.current = null; return; }
    if (usuarioIdCargado.current === session.user.id) return; // misma persona, no recargar todo
    setCargandoPerfil(true);
    obtenerUsuarioActual()
      .then((u) => { setUsuario(u); usuarioIdCargado.current = session.user.id; })
      .finally(() => setCargandoPerfil(false));
  }, [session]);

  useEffect(() => {
    if (!usuario) return;
    setCargandoDatos(true);
    setErrorDatos("");
    const cargar =
      usuario.rol === "profesor"
        ? api.fetchAlumnosConRutinas()
        : api.fetchDiasDeAlumno(usuario.id).then(({ rutinaId, days }) => [{ id: usuario.id, name: usuario.nombre, rutinaId, days }]);
    cargar
      .then((data) => setAlumnos(data))
      .catch((err) => setErrorDatos(err.message))
      .finally(() => setCargandoDatos(false));
  }, [usuario]);

  if (session === undefined || cargandoPerfil) {
    return (
      <div style={{ background: COLORS.bg, minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <span style={{ fontFamily: "Inter", fontSize: 13, color: COLORS.dim }}>Cargando...</span>
      </div>
    );
  }

  if (!session || !usuario) {
    return <Login />;
  }

  return (
    <div style={{ background: COLORS.bg, minHeight: "100%", width: "100%", padding: "28px 24px", boxSizing: "border-box" }}>
      <style>{FONT_IMPORT}</style>
      <div className="flex items-center justify-between mb-8" style={{ maxWidth: 900, margin: "0 auto 32px auto" }}>
        <div className="flex items-center gap-2.5">
          <img src={LOGO_ICON} alt="Fitnourish" style={{ height: 30, width: "auto" }} />
          <div className="flex flex-col leading-none">
            <span style={{ fontFamily: "Inter", fontSize: 22, fontWeight: 700, color: COLORS.text }}>
              Fit<span style={{ fontWeight: 400 }}>nourish</span>
            </span>
            <span style={{ fontFamily: "Inter", fontSize: 10, letterSpacing: 1.5, color: COLORS.dim, marginTop: 2 }}>
              ENTRENA CON <span style={{ color: COLORS.accent }}>CIENCIA</span>
            </span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span style={{ fontFamily: "Inter", fontSize: 13, color: COLORS.dim }}>
            Hola, <span style={{ color: COLORS.text, fontWeight: 600 }}>{usuario.nombre}</span>
          </span>
          <button
            onClick={() => cerrarSesion()}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full"
            style={{ background: COLORS.surface, color: COLORS.dim, fontFamily: "Inter", fontSize: 13 }}
          >
            <LogOut size={14} /> Salir
          </button>
        </div>
      </div>

      <div style={{ maxWidth: 900, margin: "0 auto" }}>
        {cargandoDatos ? (
          <span style={{ fontFamily: "Inter", fontSize: 13, color: COLORS.dim }}>Cargando tus datos...</span>
        ) : errorDatos ? (
          <span style={{ fontFamily: "Inter", fontSize: 13, color: COLORS.danger }}>Error al cargar: {errorDatos}</span>
        ) : usuario.rol === "alumno" && alumnos.length === 0 ? (
          <span style={{ fontFamily: "Inter", fontSize: 13, color: COLORS.dim }}>Todavía no tenés una rutina asignada.</span>
        ) : usuario.rol === "profesor" ? (
          <ProfesorView alumnos={alumnos} setAlumnos={setAlumnos} usuario={usuario} />
        ) : (
          <AlumnoView alumno={alumnos[0]} setAlumnos={setAlumnos} />
        )}
      </div>
    </div>
  );
}
