-- Mängel-Tabelle
create table maengel (
  id bigint generated by default as identity primary key,
  title text not null,
  comment text not null,
  image_path text not null,
  is_done boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Admin-Tabelle
create table admin (
  id bigint generated by default as identity primary key,
  username text not null unique,
  password text not null
);

-- Standard-Admin einfügen
insert into admin (username, password) values ('admin', 'admin');

-- RLS-Policies für die Tabellen
alter table maengel enable row level security;
create policy "Mängel sind für alle lesbar" on maengel for select using (true);
create policy "Nur Admins können Mängel erstellen/aktualisieren/löschen" on maengel for all using (auth.role() = 'authenticated');

alter table admin enable row level security;
create policy "Nur Admins können Admin-Daten verwalten" on admin for all using (auth.role() = 'authenticated'); 