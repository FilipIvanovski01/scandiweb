<?php
namespace App\Controller;

use App\Config\Database;
use App\Models\Order;

class OrderController
{
    private $connection;

    public function __construct() {
        $database = new Database();
        $this->connection = $database->getConnection();
    }

    public function saveOrder(Order $order)
    {
        try {
            $this->connection->beginTransaction();
            print_r($order);
            $queryBuilder = $this->connection->createQueryBuilder();
            $queryBuilder
                ->insert('Orders')
                ->values([
                    'product_id' => ':product_id',
                    'quantity' => ':quantity',
                ])
                ->setParameters([
                    'product_id' => $order->getProductId(),
                    'quantity' => $order->getQuantity(),
                ]);
            $queryBuilder->executeStatement();

            $orderId = $this->connection->lastInsertId();
            if (!empty($order->getChoosenAttributes())) {
                $queryBuilder = $this->connection->createQueryBuilder();
                $queryBuilder
                    ->insert('ChoosenAttributesOrders')
                    ->values([
                        'order_id' => ':order_id',
                        'attribute_id' => ':attribute_id',
                    ]);
                $attributeControler = new AttributeController();
                foreach ($order->getChoosenAttributes() as $attribute) {
                    $queryBuilder->setParameters([
                        'order_id' => $orderId,
                        'attribute_id' => $attributeControler->getAttributeId($attribute->getAttributeType(),$attribute->getValue(),$attribute->getDisplayValue()),
                    ]);
                    $queryBuilder->executeStatement();    
                }
            }

            $this->connection->commit();
            return $orderId;

        } catch (\Exception $e) {
            $this->connection->rollBack();
            throw new \RuntimeException("Failed to save order: " . $e->getMessage());
        }
    }
}
