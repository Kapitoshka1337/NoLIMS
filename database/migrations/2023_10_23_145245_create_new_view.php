<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateNewView extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        DB::statement($this->createView());
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        DB::statement($this->dropView());
    }
    private function createView(): string
    {
        return <<<SQL
            CREATE VIEW user_role AS
            SELECT `users_roles`.`id` AS `id_roles`,
            `users_`.`id` AS `id`,
            `users_`.`name` AS `name`,
            `roles`.`role` AS `role` 
            FROM ((`users_` JOIN `users_roles`) JOIN `roles`) 
            WHERE ((`users_roles`.`id_user` = `users_`.`id`) AND (`users_roles`.`id_role` = `roles`.`id`))

            CREATE VIEW res_indicator AS
            SELECT `res_indicators`.`id` AS `id`
            ,`res_indicators`.`name` AS `name`,
            `res_indicators`.`metod` AS `metod`,
            `res_indicators`.`id_department` AS `id_department`,
            `department`.`title` AS `title` 
            FROM (`res_indicators` JOIN `department`) 
            WHERE (`res_indicators`.`id_department` = `department`.`id`)

            CREATE VIEW res_sample AS
            SELECT `res_samples`.`id` AS `id`,
            `res_samples`.`id_user` AS `id_user`,
            `res_samples`.`reg_num` AS `reg_num`,
            `res_samples`.`name` AS `name`,
            `res_samples`.`date_current_check` AS `date_current_check`,
            `users_`.`name` AS `user_name` 
            FROM (`res_samples` JOIN `users_`) 
            WHERE (`res_samples`.`id_user` = `users_`.`id`)
            SQL;
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    private function dropView(): string
    {
        return <<<SQL

            DROP VIEW IF EXISTS `user_role`;
            DROP VIEW IF EXISTS `res_indicator`;
            SQL;
    }
}
