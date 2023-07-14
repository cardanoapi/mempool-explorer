SELECT
  tx_confirmed.tx_hash,
  (tx_confirmed.confirmation_time - tx_log.received) AS wait_time
FROM
  (
    tx_confirmed
    JOIN tx_log ON ((tx_log.hash = tx_confirmed.tx_hash))
  );