CREATE EVENT insert_rendiciondiario
ON SCHEDULE EVERY 1 DAY STARTS '2024-03-20 22:00:00'
DO call sp_insert_rendiciondiaria();


CREATE EVENT insert_rendicionsemanal
ON SCHEDULE EVERY 1 WEEK STARTS '2024-03-20 22:00:00'
DO call sp_insert_rendicionsemanal();