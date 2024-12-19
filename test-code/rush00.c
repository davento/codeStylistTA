void	ft_putchar(char c);

void	ft_print_line1(int x)
{
	int i;

	ft_putchar('o');
	i = 0;
	while (i < x - 2)
	{
		ft_putchar('-');
		i++;
	}
	if (x > 1)
	{
		ft_putchar('o');
	}
	ft_putchar('\n');
}

void	ft_print_line2(int x)
{
	int i;

	ft_putchar('|');
	i = 0;
	while (i < x - 2)
	{
		ft_putchar(' ');
		i++;
	}
	if (x > 1)
	{
		ft_putchar('|');
	}
	ft_putchar('\n');
}

void	ft_print_line3(int x)
{
	int i;

	ft_putchar('o');
	i = 0;
	while (i < x - 2)
	{
		ft_putchar('-');
		i++;
	}
	if (x > 1)
	{
		ft_putchar('o');
	}
	ft_putchar('\n');
}

void	rush(int x, int y)
{
	int i;

	i = 0;
	if (x > 0 && y > 0)
	{
		ft_print_line1(x);
		while (i < y - 2)
		{
			ft_print_line2(x);
			i++;
		}
		if (y > 1)
		{
			ft_print_line3(x);
		}
	}
}