create type public.app_role as enum ('admin','user');
create table public.user_roles (id uuid primary key default gen_random_uuid(), user_id uuid references auth.users(id) on delete cascade not null, role app_role not null, unique(user_id, role));
grant select on public.user_roles to authenticated;
grant all on public.user_roles to service_role;
alter table public.user_roles enable row level security;
create policy "own roles" on public.user_roles for select to authenticated using (auth.uid() = user_id);
create or replace function public.has_role(_user_id uuid, _role app_role) returns boolean language sql stable security definer set search_path = public as $$ select exists (select 1 from public.user_roles where user_id=_user_id and role=_role) $$;

create table public.products (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null, name text not null, subtitle text not null default '',
  description text not null default '', includes text[] not null default '{}',
  original_price int not null, price int not null, allows_greeting boolean not null default false,
  images text[] not null default '{}', sort_order int not null default 0);
grant select on public.products to anon, authenticated;
grant all on public.products to service_role;
alter table public.products enable row level security;
create policy "public read" on public.products for select to anon, authenticated using (true);

insert into public.products (slug,name,subtitle,description,includes,original_price,price,allows_greeting,images,sort_order) values
('grandma','מארז לסבתא','מתנה של חסד, לאישה שלימדה אותנו לאהוב','מארז עדין ומרגש לסבתא – הספר "שלוש נקישות אור" לצד מזכרות שירה שנבחרו במיוחד, כדי לומר לה תודה במילים שקשה לומר בקול.',array['ספר השירה "שלוש נקישות אור"','סימנייה','מגנט עם השיר "לגו"','תמונה ממוסגרת עם השיר "אלגוריתם של חסד"'],120,100,true,array['grandma','book','framed','magnet'],1),
('parent','מארז להורה','לאבא או לאמא – מיליונרים של הלב','מארז מלא אהבה להורה – הספר "שלוש נקישות אור" עם מזכרות שירה שמחבקות את הקשר שבין הורה לילד.',array['ספר השירה "שלוש נקישות אור"','סימנייה','מגנט עם השיר "יהונתן"','תמונה ממוסגרת עם השיר "מיליונרית של הלב"'],120,100,true,array['parent','book','framed','magnet'],2),
('book','ספר בלבד','שלוש נקישות אור – ספר הביכורים','ספר השירה הראשון של בתאל כרמונה. שירים על אהבה, משפחה, חסד וקוד – שלוש נקישות עדינות על דלת הלב.',array['ספר השירה "שלוש נקישות אור"'],75,50,false,array['book','grandma','parent'],3);

create table public.orders (
  id uuid primary key default gen_random_uuid(), created_at timestamptz not null default now(),
  order_number serial, full_name text not null, phone text not null, email text not null, address text not null,
  items jsonb not null default '[]', subtotal int not null, shipping int not null default 20, total int not null,
  bit_reference text not null, status text not null default 'pending');
grant select, update on public.orders to authenticated;
grant all on public.orders to service_role;
alter table public.orders enable row level security;
create policy "admin read" on public.orders for select to authenticated using (public.has_role(auth.uid(),'admin'));
create policy "admin update" on public.orders for update to authenticated using (public.has_role(auth.uid(),'admin'));