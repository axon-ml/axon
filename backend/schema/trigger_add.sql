PRAGMA foreign_keys = ON;
drop trigger if exists enforce_trigger;
create trigger enforce_trigger
before insert ON users
for each row
when exists (
	Select SellerID from Items 
	where Items.SellerID = new.UserID
	and Items.ItemID = new.ItemID
)
begin
	Select raise(rollback, "A user may not bid on an item he or she is also selling."); 
end;
